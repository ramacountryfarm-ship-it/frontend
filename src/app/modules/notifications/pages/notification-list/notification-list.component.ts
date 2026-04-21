import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  alerts: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAlerts();
    // Mark all as read when visiting the page
    this.markAllRead();
  }

  loadAlerts(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/dashboard/alerts`).subscribe({
      next: (data) => {
        this.alerts = data || [];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  markAllRead(): void {
    const readIds = this.alerts.map(a => a.title);
    try {
      localStorage.setItem('readNotifications', JSON.stringify(Date.now()));
    } catch (e) {}
  }

  getAlertBg(type: string): string {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  }

  getIconBg(type: string): string {
    switch (type) {
      case 'critical': return 'bg-red-100';
      case 'warning': return 'bg-orange-100';
      case 'info': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'critical': return 'text-[#FF3B30]';
      case 'warning': return 'text-[#FF9500]';
      case 'info': return 'text-brand-primary';
      default: return 'text-gray-500';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'critical': return 'Critical';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return 'Notice';
    }
  }

  getTypeBadge(type: string): string {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
