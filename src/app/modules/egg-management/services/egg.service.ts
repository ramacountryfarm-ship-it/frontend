import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EggService {
  private apiUrl = `${environment.apiUrl}/eggs`;

  constructor(private http: HttpClient) {}

  getCollection(dateFrom?: string, dateTo?: string): Observable<any> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);
    return this.http.get<any>(`${this.apiUrl}/collection`, { params });
  }

  getDamages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/damages`);
  }

  createDamage(damage: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/damages`, damage);
  }

  deleteDamage(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/damages/${id}`);
  }

  getInventory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/inventory`);
  }
}
