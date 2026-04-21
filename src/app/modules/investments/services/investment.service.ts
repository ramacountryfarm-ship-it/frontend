import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private apiUrl = `${environment.apiUrl}/investments`;

  constructor(private http: HttpClient) {}

  getAll(category?: string): Observable<any[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(investment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, investment);
  }

  update(id: string, investment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, investment);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
