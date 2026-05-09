import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggTradingService } from '../../services/egg-trading.service';

@Component({
  selector: 'app-trading-summary',
  templateUrl: './trading-summary.component.html',
  styleUrls: ['./trading-summary.component.scss']
})
export class TradingSummaryComponent implements OnInit {
  summary: any = null;
  isLoading = true;

  constructor(private service: EggTradingService, private router: Router) {}

  ngOnInit(): void {
    this.service.getSummary().subscribe({
      next: (data) => { this.summary = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get stockStatus(): string {
    if (!this.summary) return 'ok';
    if (this.summary.currentStock < 0) return 'danger';
    if (this.summary.currentStock < 500) return 'warning';
    return 'ok';
  }

  nav(path: string): void { this.router.navigate(['/egg-trading', path]); }
}
