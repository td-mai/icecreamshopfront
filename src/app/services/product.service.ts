import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from  '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Product} from '../product'
import {detailOrder} from '../detailOrder'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiRoot =  environment.apiRoot
  constructor(private  httpClient:  HttpClient) {
  }
  options: {
      headers: {
            'Content-Type': 'application/json',
          },
      mode: 'no-cors', // the most important option
      observe: 'body',
      responseType:'json',
    }
  getProducts(): Observable<Product[]> {
      return this.httpClient.get<Product[]>(this.apiRoot + "/api/products/", this.options)
        .pipe(
            catchError(this.handleError)
        );
  }

  createOrder(order_data): Observable<detailOrder> {
    return this.httpClient.post<detailOrder>(this.apiRoot + "/api/orders/", order_data, this.options)
              .pipe(
            catchError(this.handleError)
        );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
    }
      // Return an observable with a user-facing error message.
      return throwError(error);
  }
}
