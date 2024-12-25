import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Define default messages based on HTTP method
    const defaultMessages = {
      GET: 'Retrieved successfully',
      POST: 'Created successfully',
      PUT: 'Updated successfully',
      PATCH: 'Updated successfully',
      DELETE: 'Deleted successfully',
    };

    return next.handle().pipe(
      map((data) => {
        // Get the HTTP method
        const method = request.method;

        // Determine the message
        let message: string;
        if (data?.message) {
          // If data contains a message, extract and remove it
          message = data.message;
          delete data.message;
        } else {
          // Use default message based on HTTP method
          message = defaultMessages[method] || 'Operation successful';
        }

        return {
          success: true,
          data: data,
          message,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
