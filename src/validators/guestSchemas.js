import { z } from 'zod';
import { companionSchema } from './common.js';

export const createGuestSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    companions: z.array(companionSchema).default([]),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const invitationCodeParamSchema = z.object({
  params: z.object({
    invitationCode: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const guestPortalAuthSchema = z.object({
  params: z.object({
    invitationCode: z.string().uuid(),
  }),
  body: z.object({
    password: z.string().length(5),
  }),
  query: z.object({}).optional(),
});

export const checkInSchema = z.object({
  params: z.object({
    invitationCode: z.string().uuid(),
  }),
  body: z.object({
    companionIds: z.array(z.string()).default([]),
  }),
  query: z.object({}).optional(),
});
