import { z } from 'zod';

export const createPreferenceSchema = z.object({
  body: z.object({
    payer: z.object({
      name: z.string().min(2),
      email: z.string().email(),
    }),
    items: z.array(z.object({
      id: z.string().min(1),
      title: z.string().min(2),
      quantity: z.number().int().positive(),
      unit_price: z.number().positive(),
      currency_id: z.literal('BRL').default('BRL'),
    })).min(1),
    externalReference: z.string().min(6),
    metadata: z.record(z.any()).optional(),
    backUrls: z.object({
      success: z.string().url(),
      failure: z.string().url(),
      pending: z.string().url(),
    }).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
