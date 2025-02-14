import { body, check, validationResult } from 'express-validator';
import { formatErrors } from './errors.js';
import { validation as validationResponse } from './responseApi.js';
import prisma from './context.js';

const validInputOrigin = ['START'];

const validateCompetitor = [
  // Validate 'classId' - Must exist in 'class' table
  check('classId')
    .not()
    .isEmpty()
    .withMessage('Class ID is required')
    .isNumeric()
    .withMessage('Class ID must be a number')
    .custom(async (value) => {
      const existingClass = await prisma.class.findUnique({
        where: { id: value },
      });
      if (!existingClass) {
        throw new Error('Class ID does not exist in the database');
      }
      return true;
    }),

  body('origin').custom((value) => {
    if (!validInputOrigin.includes(value)) {
      throw new Error('Invalid origin');
    }
    return true; // Indicate that the validation succeeded
  }),
  // Validate 'firstname' - Required string
  check('firstname')
    .not()
    .isEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string')
    .isLength({ max: 255 })
    .withMessage('First name can be at most 255 characters long'),

  // Validate 'lastname' - Required string
  check('lastname')
    .not()
    .isEmpty()
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name must be a string')
    .isLength({ max: 255 })
    .withMessage('Last name can be at most 255 characters long'),

  // Validate 'bibNumber' - Optional, must be an integer
  check('bibNumber')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Bib number must be an integer'),

  // Validate 'nationality' - Optional, must be a 3-character country code
  check('nationality')
    .optional({ nullable: true })
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('Nationality must be a 3-letter country code'),

  // Validate 'registration' - Required, max 10 characters
  check('registration')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 10 })
    .withMessage('Registration can be at most 10 characters long'),

  // Validate 'license' - Optional, 1 character max
  check('license')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 1 })
    .withMessage('License must be 1 character'),

  // Validate 'ranking' - Optional, must be an unsigned integer
  check('ranking')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Ranking must be a positive integer'),

  // Validate 'rankPointsAvg' - Optional, must be an unsigned integer
  check('rankPointsAvg')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Rank Points Average must be a positive integer'),

  // Validate 'organisation' - Optional, max 255 characters
  check('organisation')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 255 })
    .withMessage('Organisation can be at most 255 characters long'),

  // Validate 'shortName' - Optional, max 10 characters
  check('shortName')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 10 })
    .withMessage('Short name can be at most 10 characters long'),

  // Validate 'card' - Optional, must be an integer
  check('card')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Card must be an integer'),

  // Validate 'startTime' - Optional, must be a valid datetime
  check('startTime')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Start time must be a valid datetime'),

  // Validate 'finishTime' - Optional, must be a valid datetime
  check('finishTime')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Finish time must be a valid datetime'),

  // Validate 'time' - Optional, must be an integer
  check('time')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Time must be an integer'),

  // Validate 'teamId' - Optional, must exist in 'team' table
  check('teamId')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Team ID must be an integer')
    .custom(async (value) => {
      if (value) {
        const existingTeam = await prisma.team.findUnique({
          where: { id: value },
        });
        if (!existingTeam) {
          throw new Error('Team ID does not exist in the database');
        }
      }
      return true;
    }),

  // Validate 'leg' - Optional, must be an integer
  check('leg')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Leg must be an integer'),

  // Validate 'status' - Must be one of the allowed values
  check('status')
    .optional()
    .isIn(['Inactive', 'Active', 'DidNotStart', 'Finished'])
    .withMessage(
      'Status must be one of Inactive, Active, DidNotStart, Finished',
    ),

  // Validate 'lateStart' - Optional, must be a boolean
  check('lateStart')
    .optional()
    .isBoolean()
    .withMessage('Late start must be a boolean'),

  // Validate 'note' - Optional, max 255 characters
  check('note')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 255 })
    .withMessage('Note can be at most 255 characters long'),

  // Middleware to process validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationResponse(formatErrors(errors)));
    }
    next();
  },
];

export default validateCompetitor;
