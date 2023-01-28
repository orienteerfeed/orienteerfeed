import { Router } from 'express';
import { check, validationResult } from 'express-validator';
//import { PrismaClient } from '@prisma/client';

import { validation, error, success } from '../../utils/responseApi.js';
import { formatErrors } from '../../utils/errors.js';
import prisma from '../../utils/context.js';

const router = Router();

//const prisma = new PrismaClient();

// Event routes
router.get('/', async (req, res) => {
  // Everything went fine.
  let dbResponse;
  try {
    dbResponse = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        organizer: true,
        date: true,
        location: true,
        relay: true,
        published: true,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(error(`Database error` + err.message));
  } finally {
    return res
      .status(200)
      .json(success('OK', { data: dbResponse }, res.statusCode));
  }
});

router.get(
  '/:eventId',
  [check('eventId').not().isEmpty().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validation(formatErrors(errors)));
    }
    const { eventId } = req.params;
    // Everything went fine.
    let dbResponse;
    try {
      dbResponse = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          name: true,
          date: true,
          location: true,
          organizer: true,
          relay: true,
          sport: true,
          zeroTime: true,
          classes: true,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json(
          error(
            `Event with ID ${eventId} does not exist in the database` +
              err.message,
          ),
        );
    }
    return res
      .status(200)
      .json(success('OK', { data: dbResponse }, res.statusCode));
  },
);

router.get(
  '/:eventId/results',
  [check('eventId').not().isEmpty().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validation(formatErrors(errors)));
    }
    const { eventId } = req.params;
    // Everything went fine.
    let dbResponse;
    try {
      dbResponse = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          name: true,
          classes: {
            select: {
              id: true,
              externalId: true,
              name: true,
              length: true,
              climb: true,
              controlsCount: true,
              competitors: {
                select: {
                  id: true,
                  lastname: true,
                  firstname: true,
                  organisation: true,
                  shortName: true,
                  registration: true,
                  license: true,
                  ranking: true,
                  card: true,
                  startTime: true,
                  finishTime: true,
                  time: true,
                  status: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json(
          error(
            `Event with ID ${eventId} does not exist in the database` +
              err.message,
          ),
        );
    }
    return res
      .status(200)
      .json(success('OK', { data: dbResponse }, res.statusCode));
  },
);

export default router;
