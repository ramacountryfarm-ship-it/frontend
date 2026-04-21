import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() trend: number | null = null;
  @Input() trendLabel = '';
  @Input() iconBgColor = 'bg-brand-pearl';
  @Input() iconColor = 'text-brand-primary';
  @Input() valueColor = 'text-gray-900';
}
