import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SaleService } from '../../services/sale.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  sales: any[] = [];
  isLoading = true;
  showDeleteDialog = false;
  deleteId = '';
  selectedType = '';
  selectedPaymentStatus = '';
  dateFrom = '';
  dateTo = '';
  currentPage = 1;
  pageSize = 10;
  summary: any = null;

  productTypes = ['Eggs', 'Birds', 'Meat'];
  paymentStatuses = ['Paid', 'Partial', 'Pending'];

  constructor(private saleService: SaleService, private router: Router, private toast: ToastService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSales();
    this.loadSummary();
  }

  loadSales(): void {
    this.isLoading = true;
    this.saleService.getAll(this.selectedType, this.selectedPaymentStatus, this.dateFrom, this.dateTo).subscribe({
      next: (data) => { this.sales = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadSummary(): void {
    this.saleService.getSummary().subscribe({ next: (d) => this.summary = d, error: () => {} });
  }

  onFilter(): void { this.loadSales(); }

  onResetFilter(): void {
    this.selectedType = '';
    this.selectedPaymentStatus = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.loadSales();
  }

  onAdd(): void { this.router.navigate(['/sales/new']); }
  onEdit(id: string): void { this.router.navigate(['/sales/edit', id]); }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.saleService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Sale deleted successfully'); this.loadSales(); this.loadSummary(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete sale'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  onMarkPaid(sale: any): void {
    this.saleService.markPaid(sale._id, sale.totalAmount).subscribe({
      next: () => { this.toast.success('Marked as paid'); this.loadSales(); this.loadSummary(); },
      error: () => this.toast.error('Failed to mark paid')
    });
  }

  get totalPages(): number { return Math.ceil(this.sales.length / this.pageSize); }

  get paginatedSales(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.sales.slice(start, start + this.pageSize); }

  goToPage(page: number): void { this.currentPage = page; }

  getTotalRevenue(): number {
    return this.sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  }

  getPendingRevenue(): number {
    return this.sales.filter(s => s.paymentStatus !== 'Paid').reduce((sum, s) => sum + ((s.totalAmount || 0) - (s.amountReceived || 0)), 0);
  }

  downloadInvoice(saleId: string): void {
    this.http.get(`${environment.apiUrl}/sales/${saleId}/invoice`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const invoiceNum = 'INV-' + saleId.slice(-6).toUpperCase();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoiceNum}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('Failed to generate invoice')
    });
  }

  getPaymentBadge(status: string): string {
    if (status === 'Paid') return 'bg-green-100 text-green-700';
    if (status === 'Partial') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  }
}
