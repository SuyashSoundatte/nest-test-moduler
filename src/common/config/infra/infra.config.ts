import { validateEnv } from "./validate-env";

const env = validateEnv();

export const infrastructureConfig = () => ({
  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    poolSize: env.DB_POOL ?? 10,
  },
});
