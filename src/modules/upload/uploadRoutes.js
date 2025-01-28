import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import { Parser } from 'xml2js';
import libxmljs from 'libxmljs';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

import { validation, error, success } from '../../utils/responseApi.js';
import { formatErrors } from '../../utils/errors.js';
import { createShortCompetitorHash } from '../../utils/hashUtils.js';
import { calculateCompetitorRankingPoints } from '../../utils/ranking.js';

import { storeCzechRankingData } from './uploadService.js';

import crypto from 'crypto';

const router = Router();

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file'); // the name of the form field that contains the file

const parser = new Parser({ attrkey: 'ATTR', trim: true });

const IOF_XML_SCHEMA =
  'https://raw.githubusercontent.com/international-orienteering-federation/datastandard-v3/master/IOF.xsd';

// Link all submodules here

// Upload routes

/**
 * @swagger
 * /rest/v1/upload/iof:
 *  post:
 *    summary: Upload IOX XML 3
 *    description: Upload data file containing the classes specifications, start list or result list.
 *    parameters:
 *       - in: body
 *         name: eventId
 *         required: true
 *         description: String ID of the event to upload data.
 *         schema:
 *           type: string
 *    responses:
 *      200:
 *        description: Iof xml uploaded successfully
 *      422:
 *        description: Validation errors
 *      500:
 *        description: Internal server error
 */
router.post(
  '/iof',
  upload,
  [
    check('eventId').not().isEmpty().isString(),
    check('validateXml').isBoolean().optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validation(formatErrors(errors)));
    }
    const {
      body: { eventId, validateXml },
    } = req;
    if (!req.file) {
      console.error('File not found');
      return res
        .status(422)
        .json(validation('No file uploaded', res.statusCode));
    }
    if (typeof validateXml === 'undefined' || validateXml !== 'false') {
      const xsd = await getIOFXmlSchema();
      const iofXmlValidation = validateIofXml(req.file.buffer.toString(), xsd);
      if (!iofXmlValidation.state) {
        return res
          .status(422)
          .json(validation('XML is not valid: ' + iofXmlValidation.message));
      }
    }

    // Everything went fine.
    let dbResponseEvent;
    try {
      dbResponseEvent = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          relay: true,
          ranking: true,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json(
          error(
            `Post with ID ${eventId} does not exist in the database` +
              err.message,
          ),
        );
    }

    if (!dbResponseEvent) {
      return res
        .status(422)
        .json(
          validation(
            `Event with ID ${eventId} does not exist in the database`,
            res.statusCode,
          ),
        );
    }
    let iofXml3;
    await parseXml(req, function (err, xml) {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json(error('Error parsing file: ' + err.message));
      }
      iofXml3 = xml;
    });
    const iofXmlType = checkXmlType(iofXml3);
    let dbClassLists;
    try {
      dbClassLists = await prisma.class.findMany({
        where: { eventId: eventId },
        select: {
          id: true,
          externalId: true,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(error(`Database error: ${err.message}`));
    }

    const eventName = iofXml3[Object.keys(iofXml3)[0]]['Event'][0]['Name'];

    await Promise.all(
      iofXmlType.map(async (type) => {
        if (type.jsonKey === 'ResultList') {
          // For-each class
          const classResults = iofXml3.ResultList.ClassResult;
          if (!classResults || classResults.length === 0) return;
          await Promise.all(
            classResults.map(async (classResult) => {
              // Do something with each classResult
              const classDetails = classResult.Class.shift();
              //const sourceClassId = classDetails.Id.shift()._;
              // Attempt to shift the `Id` if it exists, otherwise fallback to undefined
              const sourceClassId = classDetails.Id?.shift();
              const className = classDetails.Name.shift();

              // Determine the identifier to use for comparison
              const classIdentifier = sourceClassId || className;

              // Find the class in the database using the identifier
              const existingClass = dbClassLists.find(
                (existingClass) => existingClass.externalId === classIdentifier,
              );
              let classId;
              let sex;
              const firstLetter = className.charAt(0);
              if (firstLetter === 'H') {
                sex = 'M';
              } else if (firstLetter === 'D') {
                sex = 'F';
              } else {
                sex = 'B';
              }
              if (!existingClass) {
                const dbClassInsert = await prisma.class.create({
                  data: {
                    eventId: eventId,
                    externalId: classIdentifier,
                    name: className,
                    sex:
                      classDetails.ATTR && classDetails.ATTR.sex !== ''
                        ? classDetails.ATTR.sex
                        : sex,
                  },
                });
                classId = dbClassInsert.id;
              } else {
                classId = existingClass.id;
                await prisma.class.update({
                  data: {
                    name: className,
                    sex:
                      classDetails.ATTR && classDetails.ATTR.sex !== ''
                        ? classDetails.ATTR.sex
                        : sex,
                  },
                  where: { id: classId },
                });
              }
              if (!dbResponseEvent.relay) {
                if (!classResult.PersonResult || classResult.PersonResult === 0)
                  return;
                classResult.PersonResult.map(async (competitorResult) => {
                  const person = competitorResult.Person.shift();
                  const organisation = competitorResult.Organisation.shift();
                  const result = competitorResult.Result.shift();
                  const competitorRegistration = getCompetitorKey(
                    classId,
                    person,
                  );
                  //const tempRegistration = createShortHash();
                  const registration = competitorRegistration;
                  //TODO: check if registration is unique per competition
                  const dbCompetitorResponse =
                    await prisma.competitor.findFirst({
                      where: {
                        class: { eventId: eventId },
                        registration: registration,
                      },
                      select: { id: true },
                    });
                  let competitorId;
                  if (!dbCompetitorResponse) {
                    const dbCompetitorInsert = await prisma.competitor.create({
                      data: {
                        class: {
                          connect: {
                            id: classId,
                          },
                        },
                        firstname: person.Name[0].Given[0],
                        lastname: person.Name[0].Family[0],
                        nationality:
                          person.Nationality && person.Nationality[0].ATTR.code,
                        registration: registration,
                        organisation: organisation.Name[0],
                        bibNumber:
                          result.BibNumber &&
                          parseInt(result.BibNumber.shift()),
                        startTime: result.StartTime.shift(),
                        finishTime: result.FinishTime.shift(),
                        time: result.Time && parseInt(result.Time[0]),
                        status: result.Status.toString(),
                      },
                    });
                    competitorId = dbCompetitorInsert.id;
                  } else {
                    competitorId = dbCompetitorResponse.id;
                    await prisma.competitor.update({
                      where: { id: competitorId },
                      data: {
                        class: {
                          connect: {
                            id: classId,
                          },
                        },
                        firstname: person.Name[0].Given[0],
                        lastname: person.Name[0].Family[0],
                        nationality:
                          person.Nationality && person.Nationality[0].ATTR.code,
                        registration: registration,
                        organisation: organisation.Name[0],
                        bibNumber:
                          result.BibNumber &&
                          parseInt(result.BibNumber.shift()),
                        startTime: result.StartTime.shift(),
                        finishTime: result.FinishTime.shift(),
                        time: result.Time && parseInt(result.Time[0]),
                        status: result.Status.toString(),
                      },
                    });
                  }
                });
                // Calculate ranking points
                if (dbResponseEvent.ranking) {
                  const rankingCaluclation =
                    calculateCompetitorRankingPoints(eventId);
                  if (!rankingCaluclation) {
                    console.log('Ranking points can not be calculated');
                  }
                }
              } else {
                // TEAM COMPETITION RESULT LIST
                if (
                  !classResult.TeamResult ||
                  classResult.TeamResult.length === 0
                )
                  return;
                classResult.TeamResult.map(async (teamResult) => {
                  const team = teamResult.Name.shift();
                  const organisation = teamResult.Organisation.shift();
                  const bibNumber = teamResult.BibNumber.shift();
                  const dbRelayResponse = await prisma.team.findFirst({
                    where: {
                      class: { eventId: eventId },
                      bibNumber: parseInt(bibNumber),
                    },
                    select: { id: true },
                  });
                  let teamId;
                  if (!dbRelayResponse) {
                    const dbRelayInsert = await prisma.team.create({
                      data: {
                        class: {
                          connect: {
                            id: classId,
                          },
                        },
                        name: team,
                        organisation: organisation.Name && organisation.Name[0],
                        shortName:
                          organisation.ShortName && organisation.ShortName[0],
                        bibNumber: bibNumber && parseInt(bibNumber),
                      },
                    });
                    teamId = dbRelayInsert.id;
                  } else {
                    teamId = dbRelayResponse.id;
                    await prisma.team.update({
                      where: { id: teamId },
                      data: {
                        class: {
                          connect: {
                            id: classId,
                          },
                        },
                        name: team,
                        organisation: organisation.Name && organisation.Name[0],
                        shortName:
                          organisation.ShortName && organisation.ShortName[0],
                        bibNumber: bibNumber && parseInt(bibNumber),
                      },
                    });
                  }
                  if (
                    teamResult.TeamMemberResult &&
                    teamResult.TeamMemberResult.length > 0
                  ) {
                    teamResult.TeamMemberResult.map(
                      async (teamMemberResult) => {
                        const person = teamMemberResult.Person.shift();
                        const result = teamMemberResult.Result.shift();
                        const leg = result.Leg.shift();
                        const competitorRegistration = person.Id[0].ATTR
                          ? person.Id.find(
                              (sourceId) => sourceId.ATTR.type === 'CZE',
                            )._
                          : person.Id[0];
                        const tempRegistration = createShortHash(
                          parseInt(bibNumber) + '.' + parseInt(leg),
                        );
                        const registration =
                          competitorRegistration || tempRegistration;
                        const dbCompetitorResponse =
                          await prisma.competitor.findFirst({
                            where: {
                              teamId: teamId,
                              leg: parseInt(leg),
                            },
                            select: { id: true },
                          });
                        let competitorId;
                        if (!dbCompetitorResponse) {
                          const dbCompetitorInsert =
                            await prisma.competitor.create({
                              data: {
                                class: {
                                  connect: {
                                    id: classId,
                                  },
                                },
                                firstname: person.Name[0].Given[0],
                                lastname: person.Name[0].Family[0],
                                registration: registration,
                                card:
                                  result.ControlCard &&
                                  parseInt(result.ControlCard.shift()),
                                startTime: result.StartTime.shift(),
                                finishTime: result.FinishTime.shift(),
                                time: result.Time && parseInt(result.Time[0]),
                                status: result.Status.toString(),
                                team: {
                                  connect: {
                                    id: teamId,
                                  },
                                },
                                leg: parseInt(leg),
                              },
                            });
                          competitorId = dbCompetitorInsert.id;
                        } else {
                          competitorId = dbCompetitorResponse.id;
                          await prisma.competitor.update({
                            where: { id: competitorId },
                            data: {
                              class: {
                                connect: {
                                  id: classId,
                                },
                              },
                              firstname: person.Name[0].Given[0],
                              lastname: person.Name[0].Family[0],
                              registration: registration,
                              card:
                                result.ControlCard &&
                                parseInt(result.ControlCard.shift()),
                              startTime: result.StartTime.shift(),
                              finishTime: result.FinishTime.shift(),
                              time: result.Time && parseInt(result.Time[0]),
                              status: result.Status.toString(),
                            },
                          });
                        }
                      },
                    );
                  }
                });
              }
            }),
          );
        } else if (type.jsonKey === 'StartList') {
          // For-each class
          const classStart = iofXml3.StartList.ClassStart;
          if (classStart && classStart.length > 0) {
            await Promise.all(
              classStart.map(async (classStart) => {
                const classDetails = classStart.Class.shift();
                // Attempt to shift the `Id` if it exists, otherwise fallback to undefined
                const sourceClassId = classDetails.Id?.shift();
                const className = classDetails.Name.shift();

                // Determine the identifier to use for comparison
                const classIdentifier = sourceClassId || className;

                // Find the class in the database using the identifier
                const existingClass = dbClassLists.find(
                  (existingClass) =>
                    existingClass.externalId === classIdentifier,
                );

                let classId;
                let length,
                  climb,
                  startName,
                  controlsCount = null;
                let sex;
                const firstLetter = className.charAt(0);
                if (firstLetter === 'H') {
                  sex = 'M';
                } else if (firstLetter === 'D') {
                  sex = 'F';
                } else {
                  sex = 'B';
                }
                if (classStart.Course && classStart.Course.length > 0) {
                  length =
                    classStart.Course[0].Length &&
                    parseInt(classStart.Course[0].Length);
                  climb =
                    classStart.Course[0].Climb &&
                    parseInt(classStart.Course[0].Climb);
                  controlsCount =
                    classStart.Course[0].NumberOfControls &&
                    parseInt(classStart.Course[0].NumberOfControls);
                }
                if (classStart.StartName) startName = classStart.StartName[0];
                if (!existingClass) {
                  const dbClassInsert = await prisma.class.create({
                    data: {
                      eventId: eventId,
                      externalId: classIdentifier,
                      name: className,
                      length: length,
                      climb: climb,
                      controlsCount: controlsCount,
                      startName: startName,
                      sex:
                        classDetails.ATTR && classDetails.ATTR.sex !== ''
                          ? classDetails.ATTR.sex
                          : sex,
                    },
                  });
                  classId = dbClassInsert.id;
                } else {
                  classId = existingClass.id;
                  await prisma.class.update({
                    data: {
                      name: className,
                      length: length,
                      climb: climb,
                      controlsCount: controlsCount,
                      startName: startName,
                      sex:
                        classDetails.ATTR && classDetails.ATTR.sex !== ''
                          ? classDetails.ATTR.sex
                          : sex,
                    },
                    where: { id: classId },
                  });
                }
                if (!dbResponseEvent.relay) {
                  // INDIVIDUAL COMPETITION START LIST
                  classStart.PersonStart.map(async (competitorStart) => {
                    const person = competitorStart.Person.shift();
                    const organisation = competitorStart.Organisation.shift();
                    const start = competitorStart.Start.shift();
                    const competitorRegistration = getCompetitorKey(
                      classId,
                      person,
                    );
                    //const tempRegistration = createShortHash();
                    const registration = competitorRegistration;
                    //console.log(start);
                    //TODO: check if registration is unique per competition
                    const dbCompetitorResponse =
                      await prisma.competitor.findFirst({
                        where: {
                          class: { eventId: eventId },
                          registration: registration,
                        },
                        select: { id: true },
                      });
                    let competitorId;
                    if (!dbCompetitorResponse) {
                      const dbCompetitorInsert = await prisma.competitor.create(
                        {
                          data: {
                            class: {
                              connect: {
                                id: classId,
                              },
                            },
                            firstname: person.Name[0].Given[0],
                            lastname: person.Name[0].Family[0],
                            nationality:
                              person.Nationality &&
                              person.Nationality[0].ATTR.code,
                            registration: registration,
                            organisation:
                              organisation.Name && organisation.Name[0],
                            shortName:
                              organisation.ShortName &&
                              organisation.ShortName[0],
                            startTime: start.StartTime.shift(),
                            card:
                              start.ControlCard &&
                              parseInt(start.ControlCard.shift()),
                            bibNumber:
                              start.BibNumber &&
                              parseInt(start.BibNumber.shift()),
                            // TODO: Check status in QE start list export
                          },
                        },
                      );
                      competitorId = dbCompetitorInsert.id;
                    } else {
                      competitorId = dbCompetitorResponse.id;
                      await prisma.competitor.update({
                        where: { id: competitorId },
                        data: {
                          class: {
                            connect: {
                              id: classId,
                            },
                          },
                          firstname: person.Name[0].Given[0],
                          lastname: person.Name[0].Family[0],
                          nationality:
                            person.Nationality &&
                            person.Nationality[0].ATTR.code,
                          organisation:
                            organisation.Name && organisation.Name[0],
                          shortName:
                            organisation.ShortName && organisation.ShortName[0],
                          startTime: start.StartTime.shift(),
                          card:
                            start.ControlCard &&
                            parseInt(start.ControlCard.shift()),
                          bibNumber:
                            start.BibNumber &&
                            parseInt(start.BibNumber.shift()),
                        },
                      });
                    }
                  });
                } else {
                  // TEAM COMPETITION START LIST
                  classStart.TeamStart.map(async (teamStart) => {
                    const team = teamStart.Name.shift();
                    const organisation = teamStart.Organisation.shift();
                    const bibNumber = teamStart.BibNumber.shift();
                    const dbRelayResponse = await prisma.team.findFirst({
                      where: {
                        class: { eventId: eventId },
                        bibNumber: parseInt(bibNumber),
                      },
                      select: { id: true },
                    });
                    let teamId;
                    if (!dbRelayResponse) {
                      const dbRelayInsert = await prisma.team.create({
                        data: {
                          class: {
                            connect: {
                              id: classId,
                            },
                          },
                          name: team,
                          organisation:
                            organisation.Name && organisation.Name[0],
                          shortName:
                            organisation.ShortName && organisation.ShortName[0],
                          bibNumber: bibNumber && parseInt(bibNumber),
                        },
                      });
                      teamId = dbRelayInsert.id;
                    } else {
                      teamId = dbRelayResponse.id;
                      await prisma.team.update({
                        where: { id: teamId },
                        data: {
                          class: {
                            connect: {
                              id: classId,
                            },
                          },
                          name: team,
                          organisation:
                            organisation.Name && organisation.Name[0],
                          shortName:
                            organisation.ShortName && organisation.ShortName[0],
                          bibNumber: bibNumber && parseInt(bibNumber),
                        },
                      });
                    }
                    if (
                      teamStart.TeamMemberStart &&
                      teamStart.TeamMemberStart.length > 0
                    ) {
                      teamStart.TeamMemberStart.map(async (teamMemberStart) => {
                        const person = teamMemberStart.Person.shift();
                        const start = teamMemberStart.Start.shift();
                        const leg = start.Leg.shift();
                        const competitorRegistration = person.Id[0].ATTR
                          ? person.Id.find(
                              (sourceId) => sourceId.ATTR.type === 'CZE',
                            )._
                          : person.Id[0];
                        const tempRegistration = createShortHash(
                          parseInt(bibNumber) + '.' + parseInt(leg),
                        );
                        const registration =
                          competitorRegistration || tempRegistration;
                        const dbCompetitorResponse =
                          await prisma.competitor.findFirst({
                            where: {
                              teamId: teamId,
                              leg: parseInt(leg),
                            },
                            select: { id: true },
                          });
                        let competitorId;
                        if (!dbCompetitorResponse) {
                          const dbCompetitorInsert =
                            await prisma.competitor.create({
                              data: {
                                class: {
                                  connect: {
                                    id: classId,
                                  },
                                },
                                firstname: person.Name[0].Given[0],
                                lastname: person.Name[0].Family[0],
                                registration: registration,
                                startTime: start.StartTime.shift(),
                                card:
                                  start.ControlCard &&
                                  parseInt(start.ControlCard.shift()),
                                team: {
                                  connect: {
                                    id: teamId,
                                  },
                                },
                                leg: parseInt(leg),
                                team: {
                                  connect: {
                                    id: teamId,
                                  },
                                },
                              },
                            });
                          competitorId = dbCompetitorInsert.id;
                        } else {
                          competitorId = dbCompetitorResponse.id;
                          await prisma.competitor.update({
                            where: { id: competitorId },
                            data: {
                              class: {
                                connect: {
                                  id: classId,
                                },
                              },
                              firstname: person.Name[0].Given[0],
                              lastname: person.Name[0].Family[0],
                              registration: registration,
                              startTime: start.StartTime.shift(),
                              card:
                                start.ControlCard &&
                                parseInt(start.ControlCard.shift()),
                            },
                          });
                        }
                      });
                    } else {
                      // Remove competitors from the team when the team is empty
                      await prisma.competitor.deleteMany({
                        where: {
                          teamId: teamId,
                        },
                      });
                    }
                  });
                }
              }),
            );
          }
        } else if (type.jsonKey === 'CourseData') {
          let dbClassLists;
          try {
            dbClassLists = await prisma.class.findMany({
              where: { eventId: eventId },
              select: {
                id: true,
                name: true,
              },
            });
          } catch (err) {
            console.error(err);
            return res
              .status(500)
              .json(error(`Database error: ${err.message}`));
          }
          // For-each class
          const courseData = iofXml3.CourseData.RaceCourseData[0].Course;
          await Promise.all(
            courseData.map(async (course) => {
              const existingClass = dbClassLists.find(
                (existingClass) => existingClass.name === course.Name[0],
              );
              let classId;
              if (!existingClass) {
                const dbClassInsert = await prisma.class.create({
                  data: {
                    eventId: eventId,
                    name: course.Name[0],
                    length: course.Length && parseInt(course.Length[0]),
                    climb: course.Climb && parseInt(course.Climb[0]),
                    controlsCount:
                      course.CourseControl && course.CourseControl.length - 2,
                  },
                });
                classId = dbClassInsert.id;
              } else {
                classId = existingClass.id;
                await prisma.class.update({
                  where: { id: classId },
                  data: {
                    eventId: eventId,
                    name: course.Name[0],
                    length: course.Length && parseInt(course.Length[0]),
                    climb: course.Climb && parseInt(course.Climb[0]),
                    controlsCount:
                      course.CourseControl && course.CourseControl.length - 2,
                  },
                });
              }
            }),
          );
        }
      }),
    );
    return res
      .status(200)
      .json(
        success(
          'OK',
          { data: 'Iof xml uploaded successfully: ' + eventName },
          res.statusCode,
        ),
      );
  },
);

/**
 * @swagger
 * /rest/v1/upload/czech-ranking:
 *  post:
 *    summary: Upload CSV with Czech Ranking Data for the current month
 *    description: Upload data file containing ranking data for czech competition rules.
 *    parameters:
 *       - in: body
 *         name: file
 *         required: true
 *         description: CSV File downloaded from ORIS system.
 *         schema:
 *           type: file
 *    responses:
 *      200:
 *        description: Iof xml uploaded successfully
 *      422:
 *        description: Validation errors
 *      500:
 *        description: Internal server error
 */
router.post('/czech-ranking', upload, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(validation(formatErrors(errors)));
  }
  if (!req.file) {
    console.error('File not found');
    return res.status(422).json(validation('No file uploaded', res.statusCode));
  }

  console.log(req.file);
  if (req.file.size > 2000000) {
    console.error('File is too large');
    return res
      .status(422)
      .json(
        validation(
          'File is too large. Allowed size is up to 2MB',
          res.statusCode,
        ),
      );
  }

  try {
    const processedRankingData = await storeCzechRankingData(
      req.file.buffer.toString(),
    );
    return res.status(200).json(
      success(
        'OK',
        {
          data:
            'Csv ranking Czech data uploaded successfully: ' +
            processedRankingData,
        },
        res.statusCode,
      ),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(error(err.message, res.statusCode));
  }
});

async function parseXml(req, callback) {
  /** This function takes in two parameters, a request object and a callback function.
   * It attempts to parse the buffer of the file contained in the request object using the parser.parseStringPromise() method.
   * If successful, it calls the callback function with null as the first parameter and iofXml3 as the second parameter.
   * If an error occurs, it logs it to the console and calls the callback function with err as its only parameter.  */
  try {
    const iofXml3 = await parser.parseStringPromise(req.file.buffer.toString());
    callback(null, iofXml3);
  } catch (err) {
    console.error(err);
    callback(err);
  }
}

const checkXmlType = (json) => {
  /**
   * checkXmlType() is a function that takes in a JSON object as an argument and returns an array of objects.
   * The function checks if the JSON object contains any of the values in the iofXmlTypes array, and if so,
   * it pushes an object containing the key, value, and whether or not it is an array into the response array.
   * The returned response array will contain objects with information about any keys in the JSON object that match
   * any of the values in the iofXmlTypes array. */
  const iofXmlTypes = ['ResultList', 'StartList', 'CourseData'];
  let response = [];

  Object.entries(json).map((entry) => {
    if (iofXmlTypes.includes(entry[0])) {
      response.push({
        isArray: true,
        jsonKey: entry[0],
        jsonValue: entry,
      });
    }
  });
  return response;
};

const validateIofXml = (xmlString, xsdString) => {
  /** This code uses the libxmljs library to validate an XML string against an XSD string. It creates two variables, xmlDoc and xsdDoc,
   * that store the parsed XML and XSD strings. It then validates the xmlDoc against the xsdDoc using the validate() method.
   * If the validation is successful, it sets the state property of returnState to true. If it fails,
   * it sets the message property of returnState to the validationErrors of xmlDoc and logs this message.
   * If there is an error in validating, it sets the message property of returnState to err.message and logs this message.
   * Finally, it returns returnState regardless of whether there was an error or not. */

  let returnState = { state: false, message: '' };
  try {
    const xmlDoc = libxmljs.parseXml(xmlString);
    const xsdDoc = libxmljs.parseXml(xsdString);

    const validationResult = xmlDoc.validate(xsdDoc);
    if (validationResult) {
      returnState.state = true;
    } else {
      returnState.message = xmlDoc.validationErrors;
      console.log(returnState.message);
    }
  } catch (err) {
    returnState.message = err.message;
    console.error('Problem to validate xml: ', err.message);
  } finally {
    return returnState;
  }
};

async function getIOFXmlSchema() {
  /* This function is used to fetch the IOF XML schema. It uses the Fetch API to make a GET request to the IOF_XML_SCHEMA URL, 
  with a header of "Content-Type: application/xml". If successful, it returns the body of the response as text. 
  If an error occurs, it logs an error message to the console. */
  try {
    const response = await fetch(IOF_XML_SCHEMA, {
      method: 'get',
      headers: { 'Content-Type': 'application/xml' },
    });
    const body = await response.text();
    return body;
  } catch (err) {
    console.error('Problem to load IOF XML schema: ', err.message);
  }
}

function createShortHash(number) {
  const hash = crypto
    .createHash('sha256')
    .update(number.toString())
    .digest('hex');
  return hash.substring(0, 7);
}

export const parseXmlForTesting = {
  parseXml,
  checkXmlType,
  getIOFXmlSchema,
};

const getCompetitorKey = (classId, person) => {
  if (Array.isArray(person.Id) && person.Id.length > 0) {
    // Use the first valid ID or specific ID with type "CZE"
    const id =
      person.Id.find((sourceId) => sourceId.ATTR?.type === 'CZE')?._ ||
      person.Id[0];
    if (id) {
      return id; // Use ID if available
    }
  }

  // Fallback to concatenation of Family and Given names if ID is not present
  const familyName = person?.Name[0]?.Family[0] || '';
  const givenName = person?.Name[0]?.Given[0] || '';

  return createShortCompetitorHash(classId, familyName, givenName);
};

export default router;
