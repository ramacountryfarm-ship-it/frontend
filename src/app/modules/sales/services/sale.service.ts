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

  getAll(productType?: string): Observable<any[]> {
    let params = new HttpParams();
    if (productType) params = params.set('productType', productType);
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

  getCustomerTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/customer-types`);
  }
}
