import {
  authenticateUser,
  signupUser,
} from '../../modules/auth/authService.js';

export const signin = async (_, { input }, context) => {
  // Implement signin logic here
  const { username, password } = input;

  try {
    const loginSuccessPayload = await authenticateUser(username, password);
    return {
      token: loginSuccessPayload.token,
      user: {
        id: loginSuccessPayload.user.userId,
        firstname: loginSuccessPayload.user.firstName,
        lastname: loginSuccessPayload.user.lastName,
        email: username,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signup = async (_, { input }, context) => {
  // Implement signup logic here
  // Example: Check if user exists, hash password, save to DB, generate JWT
  const { email, password, firstname, lastname } = input;

  try {
    const token = await signupUser(
      email,
      password,
      firstname,
      lastname,
      context.activationUrl,
    );
    return {
      token: token,
      message: 'User successfuly created',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
