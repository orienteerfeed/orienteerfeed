import { Router } from 'express';
import { check, validationResult } from 'express-validator';

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
import { formatErrors } from '../../utils/errors.js';
import prisma from '../../utils/context.js';

import { changeCompetitorStatus, updateCompetitor } from './eventService.js';

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
  check('origin').not().isEmpty().isString(),
  check('status').not().isEmpty(),
  check('origin').custom((value) => {
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
  check('origin').not().isEmpty().isString(),
  check('origin').custom((value) => {
    if (!validInputOrigin.includes(value)) {
      throw new Error('Invalid origin');
    }
    return true; // Indicate that the validation succeeded
  }),
  check('card').not().isEmpty().isNumeric().isLength({ min: 4, max: 7 }),
  check('note').isString().trim().optional().isLength({ max: 255 }),
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
 *         required: true
 *         description: New compoetitor SI card number.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: note
 *         required: false
 *         description: Add note for competitor.
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

    // Everything went fine.
    try {
      const updateCompetitorMessage = await updateCompetitor(
        eventId,
        competitorId,
        origin,
        card,
        note,
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

    //TODO: Check user permissions

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
