import jwt from 'jsonwebtoken';
import { error } from './responseApi.js';

const JWT_TOKEN_SECRET_KEY = process.env.JWT_TOKEN_SECRET_KEY;

// generate JWT token with no expiration
export const getJwtToken = (payload) => jwt.sign(payload, JWT_TOKEN_SECRET_KEY);

export const generateJwtTokenForLink = (userId) => {
  const token = jwt.sign({ id: userId }, JWT_TOKEN_SECRET_KEY, {
    expiresIn: '48h',
  });
  return token;
};

/**
 * Middleware to verify JWT token from the Authorization header.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 */
// verify JWT token and save decoded payload into req.jwtDecoded
export const verifyJwtToken = (req, res, next) => {
  const tokenWithBearer = req.headers['authorization'];

  if (tokenWithBearer) {
    // Remove `Bearer `
    const token = tokenWithBearer.slice(7, tokenWithBearer.length);
    try {
      req.jwtDecoded = jwt.verify(token, JWT_TOKEN_SECRET_KEY);
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json(error('Unauthorized.', res.statusCode));
    }
  } else {
    return res
      .status(401)
      .json(error('Missing `authorization` header.', res.statusCode));
  }
};

export const verifyToken = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    return jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY); // Ensure your JWT secret is safely stored in environment variables
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verifies the token from the link and extracts the user ID.
 * @param {string} token - The token to verify.
 * @returns {string} The extracted user ID.
 */
export const getUserIdFromActivationToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_TOKEN_SECRET_KEY);
    return decoded.id;
  } catch (error) {
    console.error('Failed to verify token:', error);
    throw new Error('Invalid or expired token');
  }
};
