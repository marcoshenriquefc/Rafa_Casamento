import { z } from 'zod';

export const createGiftSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const checkoutGiftSchema = z.object({
  body: z.object({
    invitationCode: z.string().uuid(),
    items: z.array(z.object({
      giftId: z.string().min(12),
      quantity: z.number().int().positive(),
    })).min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const listOrdersSchema = z.object({
  params: z.object({ invitationCode: z.string().uuid() }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});
