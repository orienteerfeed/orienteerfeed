import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

import { getLoginSuccessPayload } from '../../utils/loginUser.js';
import { success, validation, error } from '../../utils/responseApi.js';
import { formatErrors } from '../../utils/errors.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Authenticate existing user
 *      description: User authentication
 *      parameters:
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
 *      responses:
 *        200:
 *          description: Return JWT token
 *        401:
 *          description: Not authenticated
 */
router.post(
  '/login',
  [
    check('email').not().isEmpty().trim().isEmail(),
    check('password').not().isEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json(validation(formatErrors(errors), res.statusCode));
    }
    const {
      body: { email, password },
    } = req;

    const dbUserResponse = await prisma.user.findFirst({
      where: {
        email: email,
        active: true,
      },
      select: { id: true, password: true },
    });

    if (dbUserResponse === null) {
      // For not found user, we should return same error as for bad password to not allowed guesing emails
      return res.status(401).json(error('Not authenticated.', res.statusCode));
    }

    const { password: passwordHash, id: userId } = dbUserResponse;

    bcrypt.compare(password, passwordHash, async function (err, result) {
      if (result) {
        const loginSuccessPayload = await getLoginSuccessPayload({
          userId,
          prisma,
        });

        return res
          .status(200)
          .json(success('OK', { data: loginSuccessPayload }, res.statusCode));
      } else {
        return res
          .status(401)
          .json(error('Not authenticated.', res.statusCode));
      }
    });
  },
);

/**
 * @swagger
 * /api/auth/signup:
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
    check('password').not().isEmpty().trim(),
    check('firstname').not().isEmpty().trim(),
    check('lastname').not().isEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json(validation(formatErrors(errors), res.statusCode));
    }

    const {
      body: { firstname, lastname, email, password },
    } = req;

    // validate if email is already registered
    let dbResponseUserWithEmail;
    try {
      dbResponseUserWithEmail = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: { id: true },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(error('Database errors.', res.statusCode));
    }

    if (dbResponseUserWithEmail) {
      return res
        .status(422)
        .json(error('This email is already registered.', res.statusCode));
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).json(error(err.message, res.statusCode));
      }
      let dbResponseUser;
      try {
        dbResponseUser = await prisma.user.create({
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hash,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json(error('Database errors.', res.statusCode));
      } finally {
        return res
          .status(200)
          .json(
            success('OK', { data: 'User successfuly created' }, res.statusCode),
          );
      }
    });
  },
);

export default router;
