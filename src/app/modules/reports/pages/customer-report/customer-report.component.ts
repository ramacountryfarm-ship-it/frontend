import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
})
export class CustomerReportComponent implements OnInit {
  loading = true;
  rows: any[] = [];
  totals: any = {};
  showPendingOnly = false;

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/reports/customer-report`)
      .subscribe({ next: (d) => { this.rows = d.rows; this.totals = d.totals; this.loading = false; }, error: () => { this.loading = false; } });
  }

  get visible() {
    return this.showPendingOnly ? this.rows.filter(r => r.pending > 0) : this.rows;
  }

  initial(name: string) { return (name || '?')[0].toUpperCase(); }
  inr(v: number) { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v || 0); }
}
