import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OrderRequest, OrderResponse } from '../../models/order.model';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderMockService extends ApiService {
  readonly urlPath = 'orders' as const;
  private orders: OrderResponse[] = [];

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http, envService);
    // Override the API URL with the order-specific one
    const orderApiUrl = this.envService.getEnvVar('API_ORDER_URL');
    if (orderApiUrl) {
      this.setApiUrl(orderApiUrl);
    }
  }

  /**
   * Submit a new order (mock implementation)
   * @param orderData The order data to submit
   * @returns An observable with the mock order response
   */
  submitOrder(orderData: OrderRequest): Observable<OrderResponse> {
    // Generate a mock order response
    const newOrder: OrderResponse = {
      id: `order-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      products: orderData.products,
      personalInformation: orderData.personalInformation,
      customerComment: orderData.customerComment,
      messageCustomer: orderData.messageCustomer
    };

    // Store the order in our mock database
    this.orders.push(newOrder);
    
    
    // Return the mock response after a delay to simulate network latency
    return of(newOrder).pipe(delay(800));
  }

  /**
   * Get order by ID (mock implementation)
   * @param orderId The order ID to retrieve
   * @returns An observable with the mock order details
   */
  getOrderById(orderId: string): Observable<OrderResponse> {    
    const order = this.orders.find(o => o.id === orderId);
    
    if (order) {
      return of(order).pipe(delay(500));
    } else {
      // Return a default order if not found
      return of({
        id: orderId,
        status: 'not_found',
        createdAt: new Date().toISOString(),
        products: [],
        personalInformation: {
          name: 'Not Found',
          email: 'not@found.com',
          phoneNumber: '000000000'
        },
        messageCustomer: false
      }).pipe(delay(500));
    }
  }
} 