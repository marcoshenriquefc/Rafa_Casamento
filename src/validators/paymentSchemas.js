import { z } from 'zod';

export const createPreferenceSchema = z.object({
  body: z.object({
    invitationCode: z.string().uuid(),
    giftId: z.string().min(12),
    quantity: z.number().int().positive().default(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
