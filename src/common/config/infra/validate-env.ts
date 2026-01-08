import { InfraEnvSchema } from "./infra.schema";

export function validateEnv() {
  const result = InfraEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables');
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
}