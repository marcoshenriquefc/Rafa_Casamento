import { z } from 'zod';

export const companionSchema = z.object({
  name: z.string().min(2),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
