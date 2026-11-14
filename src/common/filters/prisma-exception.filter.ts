import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js';

/**
 * Translates Prisma's client-side error codes into meaningful HTTP
 * responses instead of leaking a 500. Previously a missing row (`P2025`) or a
 * foreign-key violation (`P2003`) surfaced as an opaque "Internal server
 * error", which hid real bugs from operators.
 */
@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = this.mapKnownError(exception);
      if (mapped) {
        this.logger.warn(
          `${request.method} ${request.originalUrl} -> ${mapped.status} (${exception.code})`,
        );        response.status(mapped.status).json({
          statusCode: mapped.status,
          message: mapped.message,
          error: mapped.error,
          path: request.originalUrl,
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const body =
        typeof payload === 'string'
          ? { statusCode: status, message: payload, error: exception.name }
          : { ...(payload as object), statusCode: status, path: request.originalUrl };
      response.status(status).json(body);
      return;
    }

    this.logger.error(
      `Unhandled error on ${request.method} ${request.originalUrl}`,
      exception instanceof Error ? exception.stack : String(exception),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }

  private mapKnownError(
    error: Prisma.PrismaClientKnownRequestError,
  ): { status: number; message: string; error: string } | null {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: `Unique constraint violated on: ${this.formatTarget(error.meta)}`,
          error: 'Conflict',
        };
      case 'P2003':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Referenced record does not exist or is still in use',
          error: 'Conflict',
        };
      case 'P2025':
        return { status: HttpStatus.NOT_FOUND, message: 'Record not found', error: 'Not Found' };
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'The change would break a required relation',
          error: 'Bad Request',
        };
      case 'P2034':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Transaction conflict, please retry',
          error: 'Conflict',
        };
      default:
        return null;
    }
  }

  private formatTarget(meta: unknown): string {
    if (meta && typeof meta === 'object' && 'target' in meta) {
      const target = (meta as { target?: unknown }).target;
      if (Array.isArray(target)) return target.join(', ');
      if (typeof target === 'string') return target;
    }
    return 'unknown field';
  }
}
