import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggTradingService } from '../../services/egg-trading.service';
import { CustomerService } from '../../../customers/services/customer.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-resale-list', templateUrl: './resale-list.component.html', styleUrls: ['./resale-list.component.scss'] })
export class ResaleListComponent implements OnInit {
  data: any = { records: [], totalRevenue: 0, totalEggsSold: 0, totalPending: 0 };
  customers: any[] = [];
  isLoading = true;
  showDeleteDialog = false;
  deleteId = '';
  selectedCustomer = '';
  selectedPayment = '';
  startDate = '';
  endDate = '';
  currentPage = 1;
  pageSize = 10;
  paymentStatuses = ['', 'Paid', 'Partial', 'Pending'];

  constructor(private service: EggTradingService, private customerService: CustomerService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.customerService.getAll().subscribe(c => this.customers = c);
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.service.getResale({ customer: this.selectedCustomer, paymentStatus: this.selectedPayment, startDate: this.startDate, endDate: this.endDate }).subscribe({
      next: (d) => { this.data = d; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.load(); }
  onAdd(): void { this.router.navigate(['/egg-trading/resale/new']); }
  onEdit(id: string): void { this.router.navigate(['/egg-trading/resale/edit', id]); }
  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }
  onDeleteCancel(): void { this.showDeleteDialog = false; }
  onDeleteConfirm(): void {
    this.service.deleteResale(this.deleteId).subscribe({ next: () => { this.showDeleteDialog = false; this.toast.success('Deleted'); this.load(); }, error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete'); } });
  }

  paymentBadgeClass(s: string): string { return s === 'Paid' ? 'bg-green-100 text-green-700' : s === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'; }

  get totalPages(): number { return Math.ceil((this.data.records?.length || 0) / this.pageSize); }
  get paginated(): any[] { return (this.data.records || []).slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize); }
  goToPage(p: number): void { this.currentPage = p; }
}
