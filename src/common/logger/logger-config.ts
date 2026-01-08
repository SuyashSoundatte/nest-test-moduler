const isProd = process.env.NODE_ENV === 'production';

export const LoggerConfig = {
  level: isProd ? 'info' : 'debug',

  // // HTTP logger
  // customProps: (req) => ({
  //   context: 'HTTP',
  //   requestId: req.id,
  // }),

  // redact: {
  //   paths: ['req.headers.authorization', 'req.headers.cookie'],
  //   remove: true,
  // },

  transport: !isProd
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
};
