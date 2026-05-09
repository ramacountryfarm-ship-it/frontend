import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private apiUrl = `${environment.apiUrl}/feeds`;

  constructor(private http: HttpClient) {}

  getCommercialFeeds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/commercial`);
  }

  createCommercialFeed(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/commercial`, data);
  }

  updateCommercialFeed(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/commercial/${id}`, data);
  }

  deleteCommercialFeed(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/commercial/${id}`);
  }

  getOwnFeedMixes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/own-mix`);
  }

  getOwnFeedMixById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/own-mix/${id}`);
  }

  createOwnFeedMix(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/own-mix`, data);
  }

  updateOwnFeedMix(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/own-mix/${id}`, data);
  }

  deleteOwnFeedMix(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/own-mix/${id}`);
  }
}
