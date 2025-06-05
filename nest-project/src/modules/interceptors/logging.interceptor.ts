import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import chalk from 'chalk';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(chalk.yellow("----------------------------------------------------------------------------------------------------------------"));
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query, params } = req;
    
    // console.log(chalk.green(`[${new Date().toISOString()}] ${method} ${originalUrl}`));
    console.log(chalk.gray(`Query Params:`), query);
    console.log(chalk.gray(`Route Params:`), params);
    console.log(chalk.gray(`Body:`), body);

    const now = Date.now(); // Capture request time

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - now;
        console.log(chalk.green(`✅ SUCCESS: ${method} ${originalUrl} - ${duration}ms`));
        console.log(chalk.gray(`Response:`), data);
      }),
      catchError((err) => {
        const duration = Date.now() - now;
        console.log(chalk.red(`❌ ERROR: ${method} ${originalUrl} - ${duration}ms`));
        console.error(chalk.red(`Error:`), err.message);
        throw err;
      }),
    );
  }
}
