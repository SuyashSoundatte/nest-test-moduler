import { infrastructureConfig } from './infra/infra.config';

export const config = {
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
  load: [infrastructureConfig],
};
