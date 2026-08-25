import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // General GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint);
  }

  // General POST request
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(endpoint, body);
  }

  // General PUT request
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(endpoint, body);
  }

  // General DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(endpoint);
  }
}
