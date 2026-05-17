import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-monthly-pl',
  templateUrl: './monthly-pl.component.html',
})
export class MonthlyPlComponent implements OnInit {
  loading = true;
  rows: any[] = [];
  totals: any = {};
  months = 6;

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/reports/monthly-pl?months=${this.months}`)
      .subscribe({ next: (d) => { this.rows = [...d.rows].reverse(); this.totals = d.totals; this.loading = false; }, error: () => { this.loading = false; } });
  }

  monthLabel(m: string) {
    const [year, mon] = m.split('-');
    const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${names[+mon]} ${year}`;
  }

  inr(v: number) { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(v)); }
}
