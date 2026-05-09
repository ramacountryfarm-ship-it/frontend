import { Component, OnInit } from '@angular/core';
import { EggTradingService } from '../../services/egg-trading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-pending-payments', templateUrl: './pending-payments.component.html', styleUrls: ['./pending-payments.component.scss'] })
export class PendingPaymentsComponent implements OnInit {
  data: any = { payables: [], receivables: [], totalPayables: 0, totalReceivables: 0 };
  isLoading = true;

  constructor(private service: EggTradingService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.service.getPendingPayments().subscribe({ next: (d) => { this.data = d; this.isLoading = false; }, error: () => { this.isLoading = false; } });
  }

  daysOverdue(date: string): number {
    if (!date) return 0;
    return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  }
}
