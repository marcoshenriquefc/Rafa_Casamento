import { z } from 'zod';

export const createGiftSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative(),
    quantity: z.coerce.number().int().positive(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const checkoutGiftSchema = z.object({
  body: z.object({
    invitationCode: z.string().regex(/^\d{8}$/, 'Invitation code deve conter 8 dígitos.'),
    giftId: z.string().min(12),
    quantity: z.number().int().positive().default(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const listOrdersSchema = z.object({
  params: z.object({ invitationCode: z.string().regex(/^\d{8}$/, 'Invitation code deve conter 8 dígitos.') }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});
