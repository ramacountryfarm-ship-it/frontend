import { Component, EventEmitter, Input, Output } from '@angular/core';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() toggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Batches', route: '/batches', icon: 'batch' },
    { label: 'Daily Farm Log', route: '/daily-log', icon: 'log' },
    { label: 'Egg Management', route: '/egg-management', icon: 'egg' },
    { label: 'Egg Trading', route: '/egg-trading', icon: 'trading' },
    { label: 'Sales', route: '/sales', icon: 'sale' },
    { label: 'Investments', route: '/investments', icon: 'investment' },
    { label: 'Feed Management', route: '/feed-management', icon: 'feed' },
    { label: 'Medicine & Supplements', route: '/medicine', icon: 'medicine' },
    { label: 'Vaccination Schedule', route: '/vaccination', icon: 'vaccine' },
    { label: 'Customers', route: '/customers', icon: 'customer' },
    { label: 'Vendors', route: '/vendors', icon: 'vendor' },
    { label: 'Locations', route: '/locations', icon: 'location' },
    { label: 'Bird Breeds', route: '/bird-breeds', icon: 'breed' },
    { label: 'Reports', route: '/reports', icon: 'reports' },
    { label: 'Flock Performance', route: '/flock-performance', icon: 'performance' },
    { label: 'AI Analytics', route: '/analytics', icon: 'analytics' }
  ];

  onToggle(): void {
    this.toggle.emit();
  }
}
