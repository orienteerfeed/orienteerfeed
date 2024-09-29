import argon2 from 'argon2';
import crypto from 'crypto';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  AuthenticationError,
  DatabaseError,
  ValidationError,
} from '../../exceptions/index.js';
import prisma from '../../utils/context.js';
import { generateJwtTokenForLink } from '../../utils/jwtToken.js';
import { getLoginSuccessPayload } from '../../utils/loginUser.js';
import { sendEmail } from '../../utils/email.js';

// Correctly calculate the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// An asynchronous function to handle user authentication
export const authenticateUser = async (username, password) => {
  // Attempt to find the first user in the database with the provided email (username).
  let user;
  try {
    user = await prisma.user.findFirst({
      where: {
        email: username, // Assuming email is used as the username.
      },
      select: { id: true, password: true, active: true },
    });
  } catch (err) {
    console.error(err);
    throw new DatabaseError(`An error occurred: ` + err.message);
  }

  // If no user is found, throw an authentication error.
  // This avoids giving out information on whether the email is registered.
  if (user === null) {
    // For not found user, we should return same error as for bad password to not allowed guesing emails
    throw new AuthenticationError('Login failed');
  }

  // Destructure password hash and user ID from the found user object.
  const { password: passwordHash, id: userId } = user;

  // Verify the provided password against the stored hash using Argon2.
  const valid = await argon2.verify(passwordHash, password);

  // If the password is not valid, throw an authentication error.
  if (!valid) {
    throw new AuthenticationError('Login failed');
  }

  // Check if the user account is activated.
  if (user.active === false) {
    throw new AuthenticationError('User account is not activated');
  }

  // If the login is successful, compute the login success payload, potentially including
  // token creation, user roles, etc., depending on your application's requirements.
  const loginSuccessPayload = await getLoginSuccessPayload({
    userId,
    prisma,
  });

  return loginSuccessPayload;
};

// Function to sign up a user and send a registration confirmation email
export const signupUser = async (
  email,
  password,
  firstname,
  lastname,
  app_base_url,
) => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    // Generate a random 128-bit (16 bytes) salt
    const salt = crypto.randomBytes(16);
    const hashedPassword = await argon2.hash(password, { salt });

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
      },
    });

    // Generate JWT token for email link
    const token = generateJwtTokenForLink(user.id);

    // Construct the link to be sent via email
    const registrationConfirmFeAppLink = `${app_base_url}/${token}`;

    // Prepare and send the email
    let emailTemplate;
    // Calculate the path to the ejs file
    const templatePath = path.join(__dirname, '../../views/emails/welcome.ejs');

    await ejs
      .renderFile(templatePath, {
        user_firstname: firstname,
        user_lastname: lastname,
        user_email: email,
        confirm_link: registrationConfirmFeAppLink,
        year: new Date().getFullYear(),
      })
      .then((result) => {
        emailTemplate = result;
      })
      .catch((err) => {
        throw new ValidationError('Error Rendering email template: ' + err);
      });

    sendEmail({
      html: emailTemplate,
      text: 'OrienteerFeed',
      subject: 'Orienteering Cloud Data Hub - registration',
      emailTo: email,
      onSuccess: () => console.log('Email sent successfully!'),
      onError: (error) => {
        throw new Error('Failed to send email:' + error);
      },
    });
    return token;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error; // rethrow to be handled by the caller
    }
    console.error('Database error in createUser:', error);
    throw new DatabaseError('Failed to create user');
  }
};
