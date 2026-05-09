import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EggTradingService {
  private base = `${environment.apiUrl}/egg-trading`;

  constructor(private http: HttpClient) {}

  // Summary
  getSummary(): Observable<any> { return this.http.get<any>(`${this.base}/summary`); }
  getPendingPayments(): Observable<any> { return this.http.get<any>(`${this.base}/pending-payments`); }
  getAnalytics(): Observable<any> { return this.http.get<any>(`${this.base}/analytics`); }

  // Farmers
  getFarmers(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/farmers`); }
  getFarmerById(id: string): Observable<any> { return this.http.get<any>(`${this.base}/farmers/${id}`); }
  createFarmer(data: any): Observable<any> { return this.http.post<any>(`${this.base}/farmers`, data); }
  updateFarmer(id: string, data: any): Observable<any> { return this.http.put<any>(`${this.base}/farmers/${id}`, data); }
  deleteFarmer(id: string): Observable<any> { return this.http.delete<any>(`${this.base}/farmers/${id}`); }

  // Procurement
  getProcurement(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters?.farmer) params = params.set('farmer', filters.farmer);
    if (filters?.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    return this.http.get<any>(`${this.base}/procurement`, { params });
  }
  getProcurementById(id: string): Observable<any> { return this.http.get<any>(`${this.base}/procurement/${id}`); }
  createProcurement(data: any): Observable<any> { return this.http.post<any>(`${this.base}/procurement`, data); }
  updateProcurement(id: string, data: any): Observable<any> { return this.http.put<any>(`${this.base}/procurement/${id}`, data); }
  deleteProcurement(id: string): Observable<any> { return this.http.delete<any>(`${this.base}/procurement/${id}`); }

  // Resale
  getResale(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters?.customer) params = params.set('customer', filters.customer);
    if (filters?.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    return this.http.get<any>(`${this.base}/resale`, { params });
  }
  getResaleById(id: string): Observable<any> { return this.http.get<any>(`${this.base}/resale/${id}`); }
  createResale(data: any): Observable<any> { return this.http.post<any>(`${this.base}/resale`, data); }
  updateResale(id: string, data: any): Observable<any> { return this.http.put<any>(`${this.base}/resale/${id}`, data); }
  deleteResale(id: string): Observable<any> { return this.http.delete<any>(`${this.base}/resale/${id}`); }

  // Wastage
  getWastage(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    return this.http.get<any>(`${this.base}/wastage`, { params });
  }
  createWastage(data: any): Observable<any> { return this.http.post<any>(`${this.base}/wastage`, data); }
  updateWastage(id: string, data: any): Observable<any> { return this.http.put<any>(`${this.base}/wastage/${id}`, data); }
  deleteWastage(id: string): Observable<any> { return this.http.delete<any>(`${this.base}/wastage/${id}`); }
}
