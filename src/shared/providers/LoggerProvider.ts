import { createLogger, format, transports, type Logger } from "winston";
import { type ConsoleTransportOptions } from "winston/lib/winston/transports";

class LoggerProvider {
  private location?: string;
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        } as ConsoleTransportOptions),
      ],
    });
  }

  public setLocation(location: string) {
    this.location = location;
  }

  error(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();
    return this.logger.error({
      message,
      location: this.location,
      timestamp,
      meta,
    });
  }

  info(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();
    return this.logger.info({
      message,
      location: this.location,
      timestamp,
      meta,
    });
  }

  warn(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();
    return this.logger.warn({
      message,
      location: this.location,
      timestamp,
      meta,
    });
  }

  debug(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();
    return this.logger.debug({
      message,
      location: this.location,
      timestamp,
      meta,
    });
  }

  verbose(message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();
    return this.logger.verbose({
      message,
      location: this.location,
      timestamp,
      meta,
    });
  }
}

export const logger = new LoggerProvider();
