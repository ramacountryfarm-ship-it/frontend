import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl = `${environment.apiUrl}/performance`;

  constructor(private http: HttpClient) {}

  getMetrics(batchId?: string): Observable<any> {
    let params = new HttpParams();
    if (batchId) params = params.set('batchId', batchId);
    return this.http.get<any>(`${this.apiUrl}/metrics`, { params });
  }

  getFeedRequirements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/feed-requirements`);
  }

  getEggPrediction(batchId?: string): Observable<any> {
    let params = new HttpParams();
    if (batchId) params = params.set('batchId', batchId);
    return this.http.get<any>(`${this.apiUrl}/egg-prediction`, { params });
  }

  getFeedCostPerEgg(batchId?: string): Observable<any> {
    let params = new HttpParams();
    if (batchId) params = params.set('batchId', batchId);
    return this.http.get<any>(`${this.apiUrl}/feed-cost-per-egg`, { params });
  }
}
