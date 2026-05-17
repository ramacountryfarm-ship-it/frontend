import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-egg-trend',
  templateUrl: './egg-trend.component.html',
})
export class EggTrendComponent implements OnInit {
  loading = true;
  daily: any[] = [];
  totals: any = {};
  avgPerDay = 0;
  rangeLabel = 'Last 30 days';

  private from = '';
  private to = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setRange('Last 30 days', 30);
  }

  setRange(label: string, days: number) {
    this.rangeLabel = label;
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - days + 1);
    this.from = start.toISOString().slice(0, 10);
    this.to = now.toISOString().slice(0, 10);
    this.load();
  }

  load() {
    this.loading = true;
    const url = `${environment.apiUrl}/reports/egg-trend?from=${this.from}&to=${this.to}`;
    this.http.get<any>(url).subscribe({
      next: (d) => { this.daily = [...d.daily].reverse(); this.totals = d.totals; this.avgPerDay = d.avgPerDay; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  maxEggs() { return this.daily.reduce((m, d) => d.eggs > m ? d.eggs : m, 0); }
  progress(eggs: number) { const mx = this.maxEggs(); return mx > 0 ? eggs / mx : 0; }
  fmtDate(s: string) { try { return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); } catch { return s; } }
}
