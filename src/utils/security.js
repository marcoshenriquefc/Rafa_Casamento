import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (value) => bcrypt.hash(value, 10);
export const comparePassword = async (value, hash) => bcrypt.compare(value, hash);

export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
