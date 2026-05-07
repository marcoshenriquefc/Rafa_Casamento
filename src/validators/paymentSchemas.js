import { z } from 'zod';

export const createPreferenceSchema = z.object({
  body: z.object({
    invitationCode: z.string().regex(/^\d{8}$/, 'Invitation code deve conter 8 dígitos.'),
    giftId: z.string().min(12),
    quantity: z.number().int().positive().default(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
