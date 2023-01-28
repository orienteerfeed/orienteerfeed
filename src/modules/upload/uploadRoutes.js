import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import { Parser } from 'xml2js';
import libxmljs from 'libxmljs';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

import { validation, error, success } from '../../utils/responseApi.js';
import { formatErrors } from '../../utils/errors.js';

const router = Router();

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file'); // the name of the form field that contains the file

const parser = new Parser({ attrkey: 'ATTR', trim: true });

const IOF_XML_SCHEMA =
  'https://raw.githubusercontent.com/international-orienteering-federation/datastandard-v3/master/IOF.xsd';

// Link all submodules here

// Upload routes
router.post(
  '/iof',
  upload,
  [check('eventId').not().isEmpty().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validation(formatErrors(errors)));
    }
    const {
      body: { eventId },
    } = req;
    if (!req.file) {
      console.error('File not found');
      return res.status(400).json(error('No file uploaded'));
    }
    const xsd = await getIOFXmlSchema();
    const iofXmlValidation = validateIofXml(req.file.buffer.toString(), xsd);
    if (!iofXmlValidation.state) {
      return res
        .status(422)
        .json(validation('XML is not valid: ' + iofXmlValidation.message));
    }

    // Everything went fine.
    let dbResponse;
    try {
      dbResponse = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
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

    if (!dbResponse) {
      return res
        .status(422)
        .json(error(`Event with ID ${eventId} does not exist in the database`));
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
          await Promise.all(
            classResults.map(async (classResult) => {
              // Do something with each classResult
              const classDetails = classResult.Class.shift();
              const sourceClassId = classDetails.Id.shift()._;
              const className = classDetails.Name.shift();
              let classId;
              const dbClassResponse = await prisma.class.findFirst({
                where: { eventId: eventId, externalId: sourceClassId },
                select: { id: true },
              });
              if (!dbClassResponse) {
                const dbClassInsert = await prisma.class.create({
                  data: {
                    eventId: eventId,
                    externalId: sourceClassId,
                    name: className,
                    sex: classDetails.ATTR.sex,
                  },
                });
                classId = dbClassInsert.id;
              } else {
                classId = dbClassResponse.id;
                await prisma.class.update({
                  data: {
                    name: className,
                    sex:
                      classDetails.ATTR.sex !== ''
                        ? classDetails.ATTR.sex
                        : 'B',
                  },
                  where: { id: classId },
                });
              }
              classResult.PersonResult.map(async (competitorResult) => {
                //console.log(competitorResult);
                const person = competitorResult.Person.shift();
                const organisation = competitorResult.Organisation.shift();
                const result = competitorResult.Result.shift();
                //console.log(result);
                const registration = person.Id.find(
                  (sourceId) => sourceId.ATTR.type === 'CZE',
                )._;
                //TODO: check if registration is unique per competition
                const dbCompetitorResponse = await prisma.competitor.findFirst({
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
                      classId: classId,
                      firstname: person.Name[0].Given[0],
                      lastname: person.Name[0].Family[0],
                      nationality:
                        person.Nationality && person.Nationality[0].ATTR.code,
                      registration: registration,
                      organisation: organisation.Name[0],
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
                      classId: classId,
                      firstname: person.Name[0].Given[0],
                      lastname: person.Name[0].Family[0],
                      nationality:
                        person.Nationality && person.Nationality[0].ATTR.code,
                      registration: registration,
                      organisation: organisation.Name[0],
                      startTime: result.StartTime.shift(),
                      finishTime: result.FinishTime.shift(),
                      time: result.Time && parseInt(result.Time[0]),
                      status: result.Status.toString(),
                    },
                  });
                }
              });
            }),
          );
        } else if (type.jsonKey === 'StartList') {
          // For-each class
          const classStart = iofXml3.StartList.ClassStart;
          await Promise.all(
            classStart.map(async (classStart) => {
              //console.log(classStart);
              const existingClass = dbClassLists.find(
                (existingClass) =>
                  existingClass.externalId === classStart.Class[0].Id[0],
              );
              let classId;
              if (!existingClass) {
                const dbClassInsert = await prisma.class.create({
                  data: {
                    eventId: eventId,
                    externalId:
                      classStart.Class[0].Id && classStart.Class[0].Id[0],
                    name: classStart.Class[0].Name.shift(),
                    length:
                      classStart.Course[0].Length &&
                      parseInt(classStart.Course[0].Length),
                    climb:
                      classStart.Course[0].Climb &&
                      parseInt(classStart.Course[0].Climb),
                    controlsCount:
                      classStart.Course[0].NumberOfControls &&
                      parseInt(classStart.Course[0].NumberOfControls),
                  },
                });
                classId = dbClassInsert.id;
              } else {
                classId = existingClass.id;
                await prisma.class.update({
                  data: {
                    name: classStart.Class[0].Name.shift(),
                    length:
                      classStart.Course[0].Length &&
                      parseInt(classStart.Course[0].Length),
                    climb:
                      classStart.Course[0].Climb &&
                      parseInt(classStart.Course[0].Climb),
                    controlsCount:
                      classStart.Course[0].NumberOfControls &&
                      parseInt(classStart.Course[0].NumberOfControls),
                  },
                  where: { id: classId },
                });
              }
              classStart.PersonStart.map(async (competitorStart) => {
                const person = competitorStart.Person.shift();
                const organisation = competitorStart.Organisation.shift();
                const start = competitorStart.Start.shift();
                const registration = person.Id[0].ATTR
                  ? person.Id.find((sourceId) => sourceId.ATTR.type === 'CZE')._
                  : person.Id[0];
                //console.log(start);
                //TODO: check if registration is unique per competition
                const dbCompetitorResponse = await prisma.competitor.findFirst({
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
                      classId: classId,
                      firstname: person.Name[0].Given[0],
                      lastname: person.Name[0].Family[0],
                      nationality:
                        person.Nationality && person.Nationality[0].ATTR.code,
                      registration: registration,
                      organisation: organisation.Name && organisation.Name[0],
                      shortName:
                        organisation.ShortName && organisation.ShortName[0],
                      startTime: start.StartTime.shift(),
                      card:
                        start.ControlCard &&
                        parseInt(start.ControlCard.shift()),
                      // TODO: Check status in QE start list export
                    },
                  });
                  competitorId = dbCompetitorInsert.id;
                } else {
                  competitorId = dbCompetitorResponse.id;
                  await prisma.competitor.update({
                    where: { id: competitorId },
                    data: {
                      classId: classId,
                      firstname: person.Name[0].Given[0],
                      lastname: person.Name[0].Family[0],
                      nationality:
                        person.Nationality && person.Nationality[0].ATTR.code,
                      organisation: organisation.Name && organisation.Name[0],
                      shortName:
                        organisation.ShortName && organisation.ShortName[0],
                      startTime: start.StartTime.shift(),
                      card:
                        start.ControlCard &&
                        parseInt(start.ControlCard.shift()),
                    },
                  });
                }
              });
            }),
          );
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

export const parseXmlForTesting = {
  parseXml,
  checkXmlType,
  getIOFXmlSchema,
};

export default router;
