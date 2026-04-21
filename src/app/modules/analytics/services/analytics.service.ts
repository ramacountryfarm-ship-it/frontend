import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getWeather(lat?: number, lon?: number): Observable<any> {
    const params: any = {};
    if (lat) params.lat = lat;
    if (lon) params.lon = lon;
    return this.http.get<any>(`${this.apiUrl}/weather`, { params });
  }
}
