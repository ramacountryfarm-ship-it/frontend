import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  pageTitle = 'Dashboard';
  userName = '';
  alerts: any[] = [];
  unreadAlerts: any[] = [];
  showNotifications = false;
  notificationCount = 0;
  private alertInterval: any;
  private readAlertKeys: Set<string> = new Set();

  private routeTitleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/locations': 'Locations',
    '/bird-breeds': 'Bird Breeds',
    '/bird-breeds/info': 'Breed Info',
    '/batches': 'Batches',
    '/daily-log': 'Daily Farm Log',
    '/egg-management': 'Egg Management',
    '/investments': 'Investments',
    '/sales': 'Sales',
    '/vendors': 'Vendors',
    '/vaccination': 'Vaccination Schedule',
    '/flock-performance': 'Flock Performance',
    '/notifications': 'Notifications'
  };

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects || event.url);
      });

    const user = this.authService.getUser();
    this.userName = user?.username || 'Admin';

    // Load read alerts from localStorage
    try {
      const stored = localStorage.getItem('readAlertKeys');
      if (stored) this.readAlertKeys = new Set(JSON.parse(stored));
    } catch (e) {}
  }

  ngOnInit(): void {
    this.loadAlerts();
    this.alertInterval = setInterval(() => this.loadAlerts(), 60000);
  }

  ngOnDestroy(): void {
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
    }
  }

  loadAlerts(): void {
    this.http.get<any[]>(`${environment.apiUrl}/dashboard/alerts`).subscribe({
      next: (alerts) => {
        this.alerts = alerts || [];
        this.unreadAlerts = this.alerts.filter(a => !this.readAlertKeys.has(this.getAlertKey(a)));
        this.notificationCount = this.unreadAlerts.length;
      },
      error: () => {
        this.alerts = [];
        this.unreadAlerts = [];
        this.notificationCount = 0;
      }
    });
  }

  private getAlertKey(alert: any): string {
    return `${alert.type}::${alert.title}`;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  markAsRead(alert: any): void {
    const key = this.getAlertKey(alert);
    this.readAlertKeys.add(key);
    this.saveReadKeys();
    this.unreadAlerts = this.unreadAlerts.filter(a => this.getAlertKey(a) !== key);
    this.notificationCount = this.unreadAlerts.length;
  }

  markAllAsRead(): void {
    this.alerts.forEach(a => this.readAlertKeys.add(this.getAlertKey(a)));
    this.saveReadKeys();
    this.unreadAlerts = [];
    this.notificationCount = 0;
  }

  private saveReadKeys(): void {
    try {
      localStorage.setItem('readAlertKeys', JSON.stringify([...this.readAlertKeys]));
    } catch (e) {}
  }

  goToNotifications(): void {
    this.showNotifications = false;
    this.router.navigate(['/notifications']);
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟠';
      case 'info': return '🔵';
      default: return '⚪';
    }
  }

  getAlertClasses(type: string): string {
    switch (type) {
      case 'critical': return 'bg-red-50 text-red-600';
      case 'warning': return 'bg-orange-50 text-orange-600';
      case 'info': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  }

  private updateTitle(url: string): void {
    const matchedRoute = Object.keys(this.routeTitleMap)
      .sort((a, b) => b.length - a.length)
      .find(route => url.startsWith(route));
    this.pageTitle = matchedRoute ? this.routeTitleMap[matchedRoute] : 'Dashboard';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
