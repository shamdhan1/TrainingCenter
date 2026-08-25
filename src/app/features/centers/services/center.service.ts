import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Center } from '../models/center.model';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/centers';

  getCenters(): Observable<ApiResponse<Center[]>> {
    return this.http.get<ApiResponse<Center[]>>(this.baseUrl);
  }

  getCentersPaginated(page: number, size: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/paginated?page=${page}&size=${size}`);
  }

  getCenterById(id: number): Observable<ApiResponse<Center>> {
    return this.http.get<ApiResponse<Center>>(`${this.baseUrl}/${id}`);
  }

  createCenter(center: Center): Observable<ApiResponse<Center>> {
    return this.http.post<ApiResponse<Center>>(this.baseUrl, center);
  }

  updateCenter(id: number, center: Center): Observable<ApiResponse<Center>> {
    return this.http.put<ApiResponse<Center>>(`${this.baseUrl}/${id}`, center);
  }

  deleteCenter(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
