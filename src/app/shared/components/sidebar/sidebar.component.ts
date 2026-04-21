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
    { label: 'Locations', route: '/locations', icon: 'location' },
    { label: 'Bird Breeds', route: '/bird-breeds', icon: 'breed' },
    { label: 'Breed Info', route: '/bird-breeds/info', icon: 'info' },
    { label: 'Batches', route: '/batches', icon: 'batch' },
    { label: 'Daily Farm Log', route: '/daily-log', icon: 'log' },
    { label: 'Egg Management', route: '/egg-management', icon: 'egg' },
    { label: 'Investments', route: '/investments', icon: 'investment' },
    { label: 'Sales', route: '/sales', icon: 'sale' },
    { label: 'Vendors', route: '/vendors', icon: 'vendor' },
    { label: 'Vaccination Schedule', route: '/vaccination', icon: 'vaccine' },
    { label: 'Flock Performance', route: '/flock-performance', icon: 'performance' },
    { label: 'AI Analytics', route: '/analytics', icon: 'analytics' }
  ];

  onToggle(): void {
    this.toggle.emit();
  }
}
