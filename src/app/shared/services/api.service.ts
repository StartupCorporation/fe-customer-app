import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParamsModel } from '../models/query-params-model';
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '';

  constructor(private http: HttpClient,private envService: EnvironmentService) { 
    this.apiUrl = this.envService.getEnvVar('API_URL') || 'Not Set';  
  }

  get<R>(path: string): Observable<R> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${path}`;

    return this.http.get<R>(url, headers);
  }


  post<R, B>(path: string, body: B): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.post<R>(completeUrl, body, headers);
  }

  put<R, B>(path: string, body: B): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.put<R>(completeUrl, body, headers);
  }

  delete<R>(path: string): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.delete<R>(completeUrl, headers);
  }

  massiveDelete<R, B>(path: string, body: B): Observable<R> {
    const completeUrl = `${this.apiUrl}/${path}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body
    };

    return this.http.delete<R>(completeUrl, options);
  }

  download(path: string): Observable<Blob> {
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.get(completeUrl, {
      responseType: 'blob'
    });
  }

  uploadDownload<B>(path: string, body: B): Observable<Blob> {
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.post(completeUrl, body, {responseType: 'blob'});
  }

  generateQueryParams(paramsObj: Record<string, any>): string {
    let params = new HttpParams();
  
    for (const [key, value] of Object.entries(paramsObj)) {
      if (Array.isArray(value)) {
        // Repeated params: ?categoryIds=abc&categoryIds=def
        for (const item of value) {
          params = params.append(key, item);
        }
      } else if (value !== null && typeof value === 'object') {
        // Expand object into multiple params: ?priceRange.min=0&priceRange.max=100000
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          params = params.append(`${key}.${nestedKey}`, String(nestedValue));
        }
      } else {
        // Single param
        params = params.set(key, value);
      }
    }
  
    return params.toString();
  }
  

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        responseType: 'json'
      })
    };
  }

}
