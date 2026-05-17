import { Component } from '@angular/core';

@Component({
  selector: 'app-reports-hub',
  templateUrl: './reports-hub.component.html',
})
export class ReportsHubComponent {
  cards = [
    { title: 'Monthly P&L', subtitle: 'Revenue vs expenses, profit per month', icon: '📊', link: 'monthly-pl', color: '#204D3A' },
    { title: 'Batch Performance', subtitle: 'Eggs, FCR, mortality by batch', icon: '🐔', link: 'batch-performance', color: '#007AFF' },
    { title: 'Customer Report', subtitle: 'Top buyers, pending payments', icon: '👤', link: 'customer-report', color: '#AF52DE' },
    { title: 'Egg Production Trend', subtitle: 'Daily eggs, breakage, deaths', icon: '🥚', link: 'egg-trend', color: '#F0B322' },
  ];
}
