import { z } from 'zod';
import { USER_ROLES } from '../models/User.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(5),
    role: z.nativeEnum(USER_ROLES),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(5),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
