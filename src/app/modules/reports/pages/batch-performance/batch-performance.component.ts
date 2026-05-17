import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-batch-performance',
  templateUrl: './batch-performance.component.html',
})
export class BatchPerformanceComponent implements OnInit {
  loading = true;
  rows: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/reports/batch-performance`)
      .subscribe({ next: (d) => { this.rows = d.rows; this.loading = false; }, error: () => { this.loading = false; } });
  }

  inr(v: number) { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v || 0); }
}
