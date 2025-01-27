import { LoggerService } from '@nestjs/common';

export class LoggerFactory implements LoggerService {
	log(message: string) {}
	error(message: string, trace: string) {}
	warn(message: string) {}
	debug(message: string) {}
	verbose(message: string) {}
}
