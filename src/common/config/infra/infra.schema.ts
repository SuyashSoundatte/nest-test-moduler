// config/infrastructure/infra.schema.ts
import { z } from 'zod';

export const InfraEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string().min(1),
  DB_POOL: z.coerce.number().optional(),
});
