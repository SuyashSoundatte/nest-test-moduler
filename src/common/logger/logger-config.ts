const isProd = process.env.NODE_ENV === 'production';

export const LoggerConfig = {
  pinoHttp: {
    level: isProd ? 'info' : 'debug',

    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
      ],
      remove: true,
    },

    transport: !isProd
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyymmdd HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
};
