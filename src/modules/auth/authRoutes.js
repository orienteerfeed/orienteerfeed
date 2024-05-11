import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { authenticateUser, signupUser } from './authService.js';
import {
  AuthenticationError,
  ValidationError,
} from '../../exceptions/index.js';
import {
  success as successResponse,
  validation as validationResponse,
  error as errorResponse,
} from '../../utils/responseApi.js';
import { formatErrors } from '../../utils/errors.js';

const router = Router();

/**
 * @swagger
 * /rest/v1/auth/signin:
 *  post:
 *      summary: Authenticate existing user
 *      description: User authentication
 *      parameters:
 *       - in: body
 *         name: username
 *         required: true
 *         description: User's email as username.
 *         schema:
 *           type: string
 *           example: user@example.com
 *       - in: body
 *         name: password
 *         required: true
 *         description: User's password.
 *         schema:
 *           type: string
 *           example: Password123
 *      responses:
 *        200:
 *          description: Return JWT token
 *        401:
 *          description: Not authenticated
 *        422:
 *          description: Validation Error
 *        500:
 *          description: Internal Server Error
 */
router.post(
  '/signin',
  [
    check('username').not().isEmpty().trim().isEmail(),
    check('password').not().isEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json(validationResponse(formatErrors(errors), res.statusCode));
    }
    const {
      body: { username, password },
    } = req;

    try {
      const loginSuccessPayload = await authenticateUser(username, password);
      return res
        .status(200)
        .json(
          successResponse('OK', { data: loginSuccessPayload }, res.statusCode),
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

/**
 * @swagger
 * /rest/v1/auth/signup:
 *  post:
 *    summary: Register new user
 *    description: User registration
 *    parameters:
 *       - in: body
 *         name: firstname
 *         required: true
 *         description: User's firstname.
 *         schema:
 *           type: string
 *           example: Jan
 *       - in: body
 *         name: lastname
 *         required: true
 *         description: User's lastname.
 *         schema:
 *           type: string
 *           example: Novák
 *       - in: body
 *         name: email
 *         required: true
 *         description: User's email as username.
 *         schema:
 *           type: string
 *           example: user@example.com
 *       - in: body
 *         name: password
 *         required: true
 *         description: User's password.
 *         schema:
 *           type: string
 *           example: Password123
 *    responses:
 *      200:
 *        description: User successfuly created
 *      422:
 *        description: This email is already registered
 *      500:
 *        description: Database errors
 */
router.post(
  '/signup',
  [
    check('email').not().isEmpty().trim().isEmail(),
    check('password').not().isEmpty().trim().isLength({ min: 6 }),
    check('firstname').not().isEmpty().trim(),
    check('lastname').not().isEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json(validationResponse(formatErrors(errors), res.statusCode));
    }

    const {
      body: { firstname, lastname, email, password },
    } = req;

    try {
      await signupUser(
        email,
        password,
        firstname,
        lastname,
        req.headers['x-oricloud-app-activate-user-url'] || 'localhost',
      );
      return res
        .status(200)
        .json(
          successResponse(
            'OK',
            { data: 'User successfuly created' },
            res.statusCode,
          ),
        );
    } catch (error) {
      if (error instanceof ValidationError) {
        return res
          .status(422)
          .json(errorResponse(error.message, res.statusCode));
      }
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },
);

export default router;
