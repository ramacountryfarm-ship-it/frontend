import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BirdBreedService {
  private apiUrl = `${environment.apiUrl}/bird-breeds`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(breed: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, breed);
  }

  update(id: string, breed: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, breed);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
