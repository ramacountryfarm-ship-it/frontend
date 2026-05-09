import { Component, OnInit } from '@angular/core';
import { EggTradingService } from '../../services/egg-trading.service';

@Component({ selector: 'app-trading-analytics', templateUrl: './trading-analytics.component.html', styleUrls: ['./trading-analytics.component.scss'] })
export class TradingAnalyticsComponent implements OnInit {
  analytics: any = null;
  isLoading = true;

  constructor(private service: EggTradingService) {}

  ngOnInit(): void {
    this.service.getAnalytics().subscribe({ next: (d) => { this.analytics = d; this.isLoading = false; }, error: () => { this.isLoading = false; } });
  }
}
