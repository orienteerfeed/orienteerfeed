import { Router } from 'express';
import { body, check, oneOf, validationResult } from 'express-validator';

import {
  AuthenticationError,
  ValidationError,
  DatabaseError,
} from '../../exceptions/index.js';
import {
  validation as validationResponse,
  error as errorResponse,
  success as successResponse,
} from '../../utils/responseApi.js';

import validateEvent from '../../utils/validateEvent.js';
import { formatErrors } from '../../utils/errors.js';
import { encrypt, encodeBase64 } from '../../utils/cryptoUtils.js';
import prisma from '../../utils/context.js';

import {
  changeCompetitorStatus,
  updateCompetitor,
  getDecryptedEventPassword,
} from './eventService.js';

const router = Router();

const validInputOrigin = ['START'];
const validInputStatus = [
  'Inactive',
  'Active',
  'DidNotStart',
  'Cancelled',
  'LateStart',
];

const validateStateChangeInputs = [
  check('eventId').not().isEmpty().isString(),
  check('competitorId').not().isEmpty().isNumeric(),
  body('origin').not().isEmpty().isString(),
  check('status').not().isEmpty(),
  body('origin').custom((value) => {
    if (!validInputOrigin.includes(value)) {
      throw new Error('Invalid origin');
    }
    return true; // Indicate that the validation succeeded
  }),
  check('status').custom((value) => {
    if (!validInputStatus.includes(value)) {
      throw new Error('Invalid status');
    }
    return true; // Indicate that the validation succeeded
  }),
];

// Readable password generator for Node.js backend service
const generatePassword = (wordCount = 3) => {
  const wordList = [
    'forest',
    'map',
    'rock',
    'stone',
    'tree',
    'north',
    'east',
    'west',
    'south',
    'start',
    'finish',
    'control',
    'medal',
    'compass',
    'gps',
    'blueberry',
  ];

  // Ensure wordCount is a positive integer greater than 0
  if (!Number.isInteger(wordCount) || wordCount < 1) {
    throw new Error('wordCount must be a positive integer');
  }

  let password = '';
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    password += wordList[randomIndex] + (i < wordCount - 1 ? '-' : '');
  }

  const randomNumber = Math.floor(Math.random() * 100);
  const symbols = '!@#$%^&*';
  const randomSymbol = symbols.charAt(
    Math.floor(Math.random() * symbols.length),
  );

  return `${password}${randomNumber}${randomSymbol}`;
};

/**
 * @swagger
 * /rest/v1/events:
 *  post:
 *    summary: Create a new event
 *    description: This route creates a new event. The event data should be sent in the request body (typically in JSON format).
 *    tags:
 *      - Events
 *    security:
 *      - bearerAuth: []  # Require user login with Bearer token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - date
 *              - organizer
 *              - location
 *              - zeroTime
 *              - sportId
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the event.
 *              date:
 *                type: string
 *                format: date-time
 *                description: The date and time of the event (ISO 8601 format).
 *              organizer:
 *                type: string
 *                description: The name of the event organizer.
 *              location:
 *                type: string
 *                description: The location where the event will take place.
 *              country:
 *                type: string
 *                description: Optional 2-character country code. Must exist in the table of countries.
 *                minLength: 2
 *                maxLength: 2
 *                example: US
 *              zeroTime:
 *                type: string
 *                format: date-time
 *                description: The event's zero time (reference time point).
 *              published:
 *                type: boolean
 *                description: Whether the event is published or not.
 *              sportId:
 *                type: integer
 *                description: The ID of the sport associated with the event.
 *              ranking:
 *                type: boolean
 *                description: Optional boolean flag for ranking status.
 *                example: true
 *              coefRanking:
 *                type: number
 *                format: float
 *                description: Optional ranking coefficient (float number).
 *                example: 1.05
 *              startMode:
 *                type: string
 *                description: Optional start mode (e.g. Individual, Mass, etc.).
 *                example: Individual
 *              relay:
 *                type: boolean
 *                description: Whether the event is a relay event.
 *    responses:
 *      200:
 *        description: Event created successfully
 *      401:
 *        description: Not authenticated (missing or invalid Bearer token)
 *      422:
 *        description: Validation Error
 *      500:
 *        description: Internal Server Error
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */
router.post('/', validateEvent, async (req, res) => {
  // Destructure the body object to create variables
  const {
    name,
    date,
    organizer,
    location,
    country,
    zeroTime,
    ranking,
    coefRanking,
    startMode,
    published,
    sportId,
    relay,
  } = req.body;

  const { userId } = req.jwtDecoded;

  //TODO: Check user permissions

  // Everything went fine.
  try {
    const dateTime = new Date(date);
    const insertedEventId = await prisma.event.create({
      data: {
        name,
        date: dateTime,
        organizer,
        location,
        countryId: country,
        zeroTime: new Date(zeroTime),
        ranking,
        coefRanking,
        startMode,
        published,
        sportId,
        relay,
        authorId: userId,
      },
    });
    return res
      .status(200)
      .json(successResponse('OK', { data: insertedEventId }, res.statusCode));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res
        .status(422)
        .json(validationResponse(error.message, res.statusCode));
    } else if (error instanceof AuthenticationError) {
      return res.status(401).json(errorResponse(error.message, res.statusCode));
    }
    return res
      .status(500)
      .json(errorResponse('Internal Server Error', res.statusCode));
  }
});

/**
 * @swagger
 * /rest/v1/events/{eventId}:
 *  put:
 *    summary: Edit an existing event
 *    description: This route updates an existing event. The event ID is passed in the URL, and the updated event data should be sent in the request body (typically in JSON format).
 *    tags:
 *      - Events
 *    security:
 *      - bearerAuth: []  # Require user login with Bearer token
 *    parameters:
 *      - in: path
 *        name: eventId
 *        required: true
 *        description: The ID of the event to update.
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - date
 *              - organizer
 *              - location
 *              - zeroTime
 *              - sportId
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the event.
 *              date:
 *                type: string
 *                format: date-time
 *                description: The date and time of the event (ISO 8601 format).
 *              organizer:
 *                type: string
 *                description: The name of the event organizer.
 *              location:
 *                type: string
 *                description: The location where the event will take place.
 *              country:
 *                type: string
 *                description: Optional 2-character country code. Must exist in the table of countries.
 *                minLength: 2
 *                maxLength: 2
 *                example: US
 *              zeroTime:
 *                type: string
 *                format: date-time
 *                description: The event's zero time (reference time point).
 *              published:
 *                type: boolean
 *                description: Whether the event is published or not.
 *              sportId:
 *                type: integer
 *                description: The ID of the sport associated with the event.
 *              ranking:
 *                type: boolean
 *                description: Optional boolean flag for ranking status.
 *                example: true
 *              coefRanking:
 *                type: number
 *                format: float
 *                description: Optional ranking coefficient (float number).
 *                example: 1.05
 *              startMode:
 *                type: string
 *                description: Optional start mode (e.g. Individual, Mass, etc.).
 *                example: Individual
 *              relay:
 *                type: boolean
 *                description: Whether the event is a relay event.
 *    responses:
 *      200:
 *        description: Event updated successfully
 *      401:
 *        description: Not authenticated (missing or invalid Bearer token)
 *      422:
 *        description: Validation Error
 *      404:
 *        description: Event not found
 *      500:
 *        description: Internal Server Error
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */
router.put('/:eventId', validateEvent, async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.jwtDecoded;
  const {
    name,
    date,
    organizer,
    location,
    country,
    zeroTime,
    ranking,
    coefRanking,
    startMode,
    published,
    sportId,
    relay,
  } = req.body;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res
        .status(404)
        .json(errorResponse('Event not found', res.statusCode));
    }

    if (event.authorId !== userId) {
      return res
        .status(403)
        .json(errorResponse('Not authorized', res.statusCode));
    }

    // TODO: Add permission checks to ensure the user is allowed to edit the event

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        date: new Date(date),
        organizer,
        location,
        countryId: country,
        zeroTime: new Date(zeroTime),
        ranking,
        coefRanking,
        startMode,
        published,
        sportId,
        relay,
        authorId: userId,
      },
    });

    return res
      .status(200)
      .json(successResponse('OK', { data: updatedEvent }, res.statusCode));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res
        .status(422)
        .json(validationResponse(error.message, res.statusCode));
    } else if (error instanceof AuthenticationError) {
      return res.status(401).json(errorResponse(error.message, res.statusCode));
    }
    return res
      .status(500)
      .json(errorResponse('Internal Server Error', res.statusCode));
  }
});

/**
 * @swagger
 * /rest/v1/events/{eventId}:
 *  delete:
 *    summary: Delete an event
 *    description: Deletes the event specified by the event ID.
 *    tags:
 *       - Events
 *    security:
 *       - bearerAuth: []  # Require user login with Bearer token
 *    parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event to delete.
 *         schema:
 *           type: string
 *    responses:
 *        200:
 *          description: Event successfully deleted
 *        401:
 *          description: Not authenticated
 *        403:
 *          description: Forbidden - Not enough permissions
 *        404:
 *          description: Event not found
 *        422:
 *          description: Validation Error
 *        500:
 *          description: Internal Server Error
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */
router.delete('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.jwtDecoded; // Assuming you're using JWT to get the user ID

  // TODO: Add permission check to ensure the user can delete this event

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.authorId !== userId) {
      return res
        .status(403)
        .json(errorResponse('Event not found', res.statusCode));
    }

    // TODO: Check if the user has the right permissions to delete this event
    // For example, ensure the userId matches the authorId of the event

    await prisma.event.delete({
      where: { id: eventId },
    });

    return res
      .status(200)
      .json(successResponse('Event successfully deleted', {}, res.statusCode));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res
        .status(422)
        .json(validationResponse(error.message, res.statusCode));
    } else if (error instanceof AuthenticationError) {
      return res.status(401).json(errorResponse(error.message, res.statusCode));
    }
    return res
      .status(500)
      .json(errorResponse('Internal Server Error', res.statusCode));
  }
});

/**
 * @swagger
 * /rest/v1/events/generate-password:
 *  post:
 *    summary: Set or create an event password
 *    description: Creates and stores an event password for an event.
 *    tags:
 *       - Events
 *    security:
 *       - bearerAuth: []  # Require user login with Bearer token
 *    parameters:
 *       - in: body
 *         name: eventId
 *         required: true
 *         description: The ID of the event for which to create the password.
 *         schema:
 *           type: string
 *    responses:
 *        200:
 *          description: Event password successfully stored
 *        401:
 *          description: Not authenticated
 *        403:
 *          description: Forbidden - Not enough permissions
 *        404:
 *          description: Event not found
 *        500:
 *          description: Internal Server Error
 */

router.post('/generate-password', async (req, res) => {
  const { eventId } = req.body;
  const { userId } = req.jwtDecoded; // Assuming JWT contains userId

  const eventPassword = generatePassword(3);

  // Encrypt the password and passphrase
  const encryptedPassword =
    typeof eventPassword !== 'undefined'
      ? encodeBase64(encrypt(eventPassword))
      : undefined;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.authorId !== userId) {
      return res
        .status(403)
        .json(
          errorResponse(
            'Event not found or you don`t have a permissions',
            res.statusCode,
          ),
        );
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    await prisma.eventPassword.upsert({
      where: { eventId }, // eventId must be unique in your schema
      update: {
        password: encryptedPassword, // Update the encrypted password
        expiresAt, // Update the expiration
        updatedAt: new Date(), // Automatically updated
      },
      create: {
        event: { connect: { id: eventId } }, // Connect the existing event by its ID
        password: encryptedPassword, // Store the encrypted password
        expiresAt, // Set the expiration time
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res
      .status(200)
      .json(
        successResponse(
          'OK',
          { data: { password: eventPassword, expiresAt: expiresAt } },
          res.statusCode,
        ),
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse('Internal Server Error', res.statusCode));
  }
});

/**
 * @swagger
 * /rest/v1/events/revoke-password:
 *  post:
 *    summary: Delete an event password
 *    description: Revoke access to the event via event password.
 *    tags:
 *       - Events
 *    security:
 *       - bearerAuth: []  # Require user login with Bearer token
 *    parameters:
 *       - in: body
 *         name: eventId
 *         required: true
 *         description: The ID of the event for which to create the password.
 *         schema:
 *           type: string
 *    responses:
 *        200:
 *          description: Event password successfully revoked
 *        401:
 *          description: Not authenticated
 *        403:
 *          description: Forbidden - Not enough permissions
 *        404:
 *          description: Event not found
 *        500:
 *          description: Internal Server Error
 */

router.post('/revoke-password', async (req, res) => {
  const { eventId } = req.body;
  const { userId } = req.jwtDecoded; // Assuming JWT contains userId

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.authorId !== userId) {
      return res
        .status(404)
        .json(
          errorResponse(
            'Event not found or you don`t have a permissions',
            res.statusCode,
          ),
        );
    }

    const deletedEventPassword = await prisma.eventPassword.delete({
      where: { eventId }, // eventId must be unique in your schema
    });

    return res
      .status(200)
      .json(
        successResponse(
          'OK',
          { data: { ...deletedEventPassword } },
          res.statusCode,
        ),
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse('Internal Server Error', res.statusCode));
  }
});

/**
 * @swagger
 * /rest/v1/events/{eventId}/password:
 *  get:
 *    summary: Get the event password
 *    description: Retrieve the stored password for an event.
 *    tags:
 *       - Events
 *    security:
 *       - bearerAuth: []  # Require user login with Bearer token
 *    parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event for which to retrieve the password.
 *         schema:
 *           type: string
 *    responses:
 *        200:
 *          description: Event password retrieved
 *        401:
 *          description: Not authenticated
 *        403:
 *          description: Forbidden - Not enough permissions
 *        404:
 *          description: Event not found
 *        500:
 *          description: Internal Server Error
 */
router.get('/:eventId/password', async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.jwtDecoded; // Assuming JWT contains userId

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (event.authorId !== userId) {
    return res
      .status(403)
      .json(errorResponse('Not authorized', res.statusCode));
  }

  try {
    const eventPassword = await getDecryptedEventPassword(eventId);

    // Check if eventPassword exists, if not, return an empty data object
    const responseData = eventPassword
      ? {
          password: eventPassword.password,
          expiresAt: eventPassword.expiresAt,
        }
      : {}; // Empty object if eventPassword is null or undefined
    return res.status(200).json(
      successResponse(
        'OK',
        {
          data: responseData,
        },
        res.statusCode,
      ),
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return res
        .status(422)
        .json(validationResponse(error.message, res.statusCode));
    } else if (error instanceof AuthenticationError) {
      return res.status(401).json(errorResponse(error.message, res.statusCode));
    }
    return res
      .status(500)
      .json(errorResponse('Internal Server Error', res.statusCode));
  }
});

/**
 * @swagger
 * /rest/v1/events/{eventId}/competitors/{competitorId}/status-change:
 *  post:
 *    summary: Update competitor status
 *    description: Change competitor status. For example from the start procecudere set status Active or DidNotStart
 *    parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the event to retrieve.
 *         schema:
 *           type: string
 *       - in: path
 *         name: competitorId
 *         required: true
 *         description: ID of the competitor whose status you want to change.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: origin
 *         required: true
 *         description: Origin point from the change comes (e.g. START).
 *         schema:
 *           type: string
 *       - in: body
 *         name: status
 *         required: true
 *         description: New compoetitor status (e.g. Inactive, Active, DidNotStart,  LateStart or Cancelled).
 *         schema:
 *           type: string
 *    responses:
 *        200:
 *          description: Return successful message
 *        401:
 *          description: Not authenticated
 *        422:
 *          description: Validation Error
 *        500:
 *          description: Internal Server Error
 */
router.post(
  '/:eventId/competitors/:competitorId/status-change',
  validateStateChangeInputs,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationResponse(formatErrors(errors)));
    }
    const { eventId, competitorId } = req.params;
    const { status, origin } = req.body;
    const { userId } = req.jwtDecoded;

    //TODO: Check user permissions
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (event.authorId !== userId) {
      return res
        .status(403)
        .json(errorResponse('Not authorized', res.statusCode));
    }

    // Everything went fine.
    try {
      const statusChangeMessage = await changeCompetitorStatus(
        eventId,
        parseInt(competitorId),
        origin,
        status,
        userId,
      );
      return res
        .status(200)
        .json(
          successResponse('OK', { data: statusChangeMessage }, res.statusCode),
        );
    } catch (error) {
      if (error instanceof ValidationError) {
        return res
          .status(422)
          .json(validationResponse(error.message, res.statusCode));
      } else if (error instanceof AuthenticationError) {
        return res
          .status(401)
          .json(errorResponse(error.message, res.statusCode));
      }
      return res
        .status(500)
        .json(errorResponse('Internal Server Error', res.statusCode));
    }
  },
);

const validateUpdateCompetitorInputs = [
  check('eventId').not().isEmpty().isString(),
  check('competitorId').not().isEmpty().isNumeric(),
  body('origin').not().isEmpty().isString(),
  body('origin').custom((value) => {
    if (!validInputOrigin.includes(value)) {
      throw new Error('Invalid origin');
    }
    return true; // Indicate that the validation succeeded
  }),
  oneOf(
    [
      check('card')
        .exists()
        .withMessage('card is required if note is not provided')
        .isNumeric(),
      check('note')
        .exists()
        .withMessage('note is required if card is not provided')
        .isString()
        .trim()
        .isLength({ max: 255 }),
    ],
    'Either card or note must be provided',
  ),
];

/**
 * @swagger
 * /rest/v1/events/{eventId}/competitors/{competitorId}:
 *  put:
 *    summary: Update competitor's data
 *    description: Change competitor status. For example from the start procecudere set status Active or DidNotStart
 *    parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the event to retrieve.
 *         schema:
 *           type: string
 *       - in: path
 *         name: competitorId
 *         required: true
 *         description: ID of the competitor whose status you want to change.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: origin
 *         required: true
 *         description: Origin point from the change comes (e.g. START).
 *         schema:
 *           type: string
 *       - in: body
 *         name: card
 *         required: false
 *         description: New compoetitor SI card number.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: note
 *         required: false
 *         description: Note for competitor.
 *         schema:
 *           type: string
 *    responses:
 *        200:
 *          description: Return successful message
 *        401:
 *          description: Not authenticated
 *        422:
 *          description: Validation Error
 *        500:
 *          description: Internal Server Error
 */
router.put(
  '/:eventId/competitors/:competitorId',
  validateUpdateCompetitorInputs,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationResponse(formatErrors(errors)));
    }
    const { eventId, competitorId } = req.params;
    const { origin, card, note } = req.body;
    const { userId } = req.jwtDecoded;

    //TODO: Check user permissions
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (event.authorId !== userId) {
      return res
        .status(403)
        .json(errorResponse('Not authorized', res.statusCode));
    }

    // Everything went fine.
    try {
      // Build update object conditionally
      const updateData = {};
      if (typeof card !== 'undefined') {
        updateData.card = parseInt(card);
      }
      if (typeof note !== 'undefined') {
        updateData.note = note;
      }

      const updateCompetitorMessage = await updateCompetitor(
        eventId,
        competitorId,
        origin,
        updateData,
        userId,
      );
      return res
        .status(200)
        .json(
          successResponse(
            'OK',
            { data: updateCompetitorMessage },
            res.statusCode,
          ),
        );
    } catch (error) {
      console.error(error);
      if (error instanceof ValidationError) {
        return res
          .status(422)
          .json(validationResponse(error.message, res.statusCode));
      } else if (error instanceof AuthenticationError) {
        return res
          .status(401)
          .json(errorResponse(error.message, res.statusCode));
      } else if (error instanceof DatabaseError) {
        return res
          .status(500)
          .json(errorResponse(error.message, res.statusCode));
      }
      return res
        .status(500)
        .json(errorResponse('Internal Server Error', res.statusCode));
    }
  },
);

/**
 * @swagger
 * /rest/v1/events/{eventId}/changelog:
 *  get:
 *    summary: Get changelog for the event
 *    description: Get protocol of all changes in competitor's data
 *    parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the event to retrieve the protocol.
 *         schema:
 *           type: string
 *    responses:
 *        200:
 *          description: Return successful message
 *        401:
 *          description: Not authenticated
 *        422:
 *          description: Validation Error
 *        500:
 *          description: Internal Server Error
 */
router.get(
  '/:eventId/changelog',
  [check('eventId').not().isEmpty().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationResponse(formatErrors(errors)));
    }
    const { eventId } = req.params;
    const { userId } = req.jwtDecoded;

    //TODO: Check user permissions
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (event.authorId !== userId) {
      return res
        .status(403)
        .json(errorResponse('Not authorized', res.statusCode));
    }

    // Everything went fine.
    //TODO: make check event existance separately in middleware function
    let dbResponseEvent;
    try {
      dbResponseEvent = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json(errorResponse(`An error occurred: ` + err.message));
    }

    if (!dbResponseEvent) {
      return res
        .status(422)
        .json(
          errorResponse(
            `Event with ID ${eventId} does not exist in the database`,
            422,
          ),
        );
    }
    let dbProtocolResponse;
    try {
      dbProtocolResponse = await prisma.protocol.findMany({
        where: { eventId: eventId },
        orderBy: [
          {
            createdAt: 'asc',
          },
        ],
        select: {
          id: true,
          competitorId: true,
          competitor: {
            select: {
              lastname: true,
              firstname: true,
            },
          },
          origin: true,
          type: true,
          previousValue: true,
          newValue: true,
          author: {
            select: {
              lastname: true,
              firstname: true,
            },
          },
          createdAt: true,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json(errorResponse(`An error occurred: ` + err.message));
    } finally {
      return res
        .status(200)
        .json(
          successResponse('OK', { data: dbProtocolResponse }, res.statusCode),
        );
    }
  },
);

export default router;
