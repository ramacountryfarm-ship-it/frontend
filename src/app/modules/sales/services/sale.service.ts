import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getAll(productType?: string, paymentStatus?: string, dateFrom?: string, dateTo?: string): Observable<any[]> {
    let params = new HttpParams();
    if (productType) params = params.set('productType', productType);
    if (paymentStatus) params = params.set('paymentStatus', paymentStatus);
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(sale: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, sale);
  }

  update(id: string, sale: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, sale);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  markPaid(id: string, amountReceived: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/mark-paid`, { amountReceived });
  }

  getCustomerTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/customer-types`);
  }
}
