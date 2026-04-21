import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {
  private apiUrl = `${environment.apiUrl}/vaccinations`;

  constructor(private http: HttpClient) {}

  getAll(status?: string): Observable<any[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(vaccination: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, vaccination);
  }

  update(id: string, vaccination: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, vaccination);
  }

  toggleStatus(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/toggle`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
