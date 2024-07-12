import { Logger } from '@nestjs/common';

export function LoggerMiddleware(req, res, next) {
  Logger.debug(
    `${req.headers['user-agent'].split(') ')[0]})`,
    'Bootstrap',
    false,
  );
  next();
}
