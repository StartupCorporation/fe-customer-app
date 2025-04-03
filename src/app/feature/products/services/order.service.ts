import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OrderRequest, OrderResponse } from '../models/order.model';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService {
  readonly urlPath = 'order' as const;

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http, envService);
    // Override the API URL with the order-specific one
    const orderApiUrl = this.envService.getEnvVar('API_ORDER_URL');
    if (orderApiUrl) {
      this.setApiUrl(orderApiUrl);
    }
  }

  /**
   * Submit a new order
   * @param orderData The order data to submit
   * @returns An observable with the order response
   */
  submitOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.post<OrderResponse, OrderRequest>(this.urlPath, orderData).pipe(
      tap(response => console.log('Order submitted successfully:', response)),
      catchError(error => {
        console.error('Error submitting order:', error);
        return throwError(() => new Error('Failed to submit order. Please try again.'));
      })
    );
  }

  /**
   * Get order by ID
   * @param orderId The order ID to retrieve
   * @returns An observable with the order details
   */
  getOrderById(orderId: string): Observable<OrderResponse> {
    const path = `${this.urlPath}/${orderId}`;
    return this.get<OrderResponse>(path).pipe(
      catchError(error => {
        console.error('Error fetching order:', error);
        return throwError(() => new Error('Failed to fetch order details.'));
      })
    );
  }
} 