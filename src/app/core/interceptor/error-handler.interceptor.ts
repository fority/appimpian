import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/services/loading.service';

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private message = inject(MessageService);
  private loadingService = inject(LoadingService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('ErrorHandlerInterceptor');
    return next.handle(request).pipe(catchError((error) => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
    }

    if (response instanceof HttpErrorResponse) {
      switch (response.status) {
        case 400:
          this.message.add({ severity: 'error', summary: response.status.toString(), detail: 'Bad Request' });
          break;
        case 401:
          this.message.add({ severity: 'error', summary: response.status.toString(), detail: 'Unauthorized' });
          break;
        case 403:
          this.message.add({ severity: 'error', summary: response.status.toString(), detail: 'Forbidden' });
          break;
        case 404:
          this.message.add({ severity: 'error', summary: response.status.toString(), detail: 'Not Found' });
          break;
        case 409:
          this.message.add({ severity: 'error', summary: response.status.toString(), detail: 'Conflict' });
          break;
        case 500:
          this.message.add({
            severity: 'error',
            summary: response.status.toString(),
            detail: `Message: ${response.error?.message}`,
          });
          this.loadingService.stop();
          break;
        case 503:
          this.message.add({ severity: 'error', summary: response.status.toString(), detail: `Service Unavailable` });
          this.loadingService.stop();
          break;
        case 0:
          this.message.add({ severity: 'error', summary: response.status.toString(), detail: `Unknown Error` });
          this.loadingService.stop();
          break;

        default:
          this.message.add({ severity: 'error', summary: `${response.status.toString()}, detail: ${response.message}` });
          this.loadingService.stop();
          break;
      }
    }
    throw response;
  }
}
