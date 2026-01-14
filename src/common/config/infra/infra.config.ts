import { validateEnv } from "./validate-env";

const env = validateEnv();

export const infrastructureConfig = () => ({
  database: {
    POSTGRES_URL: env.POSTGRES_URL
  },
});
