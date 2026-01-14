// config/infrastructure/infra.schema.ts
import { z } from 'zod';

export const InfraEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),

  POSTGRES_URL: z.string()
});
