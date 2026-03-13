import { validateEnv } from './validate-env';

const env = validateEnv();

export const infrastructureConfig = () => ({
  database: {
    POSTGRES_URL: env.POSTGRES_URL,
  },
  jwt: {
    JWT_SECRET: env.JWT_SECRET,
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
  },
});
