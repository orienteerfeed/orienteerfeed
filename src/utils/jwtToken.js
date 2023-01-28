import jwt from 'jsonwebtoken';
import { error } from './responseApi.js';

const JWT_TOKEN_SECRET_KEY = process.env.JWT_TOKEN_SECRET_KEY;

// generate JWT token with no expiration
export const getJwtToken = (payload) => jwt.sign(payload, JWT_TOKEN_SECRET_KEY);

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
