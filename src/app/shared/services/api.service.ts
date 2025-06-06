import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { QueryParamsModel } from '../models/query-params-model';
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected apiUrl = '';

  constructor(protected http: HttpClient, protected envService: EnvironmentService) { 
    this.apiUrl = this.envService.getEnvVar('API_URL') || 'Not Set';
  }

  /**
   * Set a custom API URL for this service instance
   * @param customApiUrl The custom API URL to use
   */
  protected setApiUrl(customApiUrl: string): void {
    this.apiUrl = customApiUrl;
  }

  /**
   * Get the current API URL
   * @returns The current API URL
   */
  protected getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Make a GET request
   * @param path The path to append to the API URL
   * @param customApiUrl Optional custom API URL to use for this request
   * @returns An observable of the response
   */
  get<R>(path: string, customApiUrl?: string): Observable<R> {
    const headers = this.getHeaders();
    const url = `${customApiUrl || this.apiUrl}/${path}`;

    return this.http.get<R>(url, headers).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Make a POST request
   * @param path The path to append to the API URL
   * @param body The request body
   * @param customApiUrl Optional custom API URL to use for this request
   * @returns An observable of the response
   */
  post<R, B>(path: string, body: B, customApiUrl?: string): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${customApiUrl || this.apiUrl}/${path}`;

    return this.http.post<R>(completeUrl, body, headers);
  }

  /**
   * Make a PUT request
   * @param path The path to append to the API URL
   * @param body The request body
   * @param customApiUrl Optional custom API URL to use for this request
   * @returns An observable of the response
   */
  put<R, B>(path: string, body: B, customApiUrl?: string): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${customApiUrl || this.apiUrl}/${path}`;

    return this.http.put<R>(completeUrl, body, headers);
  }

  /**
   * Make a DELETE request
   * @param path The path to append to the API URL
   * @param customApiUrl Optional custom API URL to use for this request
   * @returns An observable of the response
   */
  delete<R>(path: string, customApiUrl?: string): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${customApiUrl || this.apiUrl}/${path}`;

    return this.http.delete<R>(completeUrl, headers);
  }

  /**
   * Make a DELETE request with a request body
   * @param path The path to append to the API URL
   * @param body The request body
   * @param customApiUrl Optional custom API URL to use for this request
   * @returns An observable of the response
   */
  massiveDelete<R, B>(path: string, body: B, customApiUrl?: string): Observable<R> {
    const completeUrl = `${customApiUrl || this.apiUrl}/${path}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body
    };

    return this.http.delete<R>(completeUrl, options);
  }

  /**
   * Download a file
   * @param path The path to append to the API URL
   * @param customApiUrl Optional custom API URL to use for this request
   * @returns An observable of the blob
   */
  download(path: string, customApiUrl?: string): Observable<Blob> {
    const completeUrl = `${customApiUrl || this.apiUrl}/${path}`;

    return this.http.get(completeUrl, {
      responseType: 'blob'
    });
  }

  /**
   * Upload a file and download the response
   * @param path The path to append to the API URL
   * @param body The request body
   * @param customApiUrl Optional custom API URL to use for this request
   * @returns An observable of the blob
   */
  uploadDownload<B>(path: string, body: B, customApiUrl?: string): Observable<Blob> {
    const completeUrl = `${customApiUrl || this.apiUrl}/${path}`;

    return this.http.post(completeUrl, body, {responseType: 'blob'});
  }

  /**
   * Generate query parameter string from object
   * @param params Object containing parameter key-value pairs
   * @returns Query string (without leading ?)
   */
  protected generateQueryParams(params: Record<string, any>): string {
    const queryParams: string[] = [];
    
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        // Handle arrays
        if (Array.isArray(params[key])) {
          params[key].forEach((value: any) => {
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
          });
        } else {
          queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        }
      }
    }
    
    return queryParams.join('&');
  }

  /**
   * Get HTTP headers
   * @returns HTTP headers with content type
   */
  protected getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}
