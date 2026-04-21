import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getCharts(from?: string, to?: string): Observable<any> {
    let url = `${this.apiUrl}/charts`;
    if (from && to) {
      url += `?from=${from}&to=${to}`;
    }
    return this.http.get(url);
  }

  getAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts`);
  }
}
