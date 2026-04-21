import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DailyLogService {
  private apiUrl = `${environment.apiUrl}/daily-logs`;

  constructor(private http: HttpClient) {}

  getAll(dateFrom?: string, dateTo?: string): Observable<any[]> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(log: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, log);
  }

  update(id: string, log: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, log);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
