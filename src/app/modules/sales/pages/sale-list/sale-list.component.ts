import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { ToastService } from '../../../../shared/services/toast.service';

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
  currentPage = 1;
  pageSize = 10;

  productTypes = ['', 'Eggs', 'Birds', 'Meat'];

  constructor(private saleService: SaleService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.loadSales(); }

  loadSales(): void {
    this.isLoading = true;
    this.saleService.getAll(this.selectedType).subscribe({
      next: (data) => { this.sales = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.loadSales(); }
  onAdd(): void { this.router.navigate(['/sales/new']); }
  onEdit(id: string): void { this.router.navigate(['/sales/edit', id]); }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.saleService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Sale deleted successfully'); this.loadSales(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete sale'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  get totalPages(): number { return Math.ceil(this.sales.length / this.pageSize); }

  get paginatedSales(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.sales.slice(start, start + this.pageSize); }

  goToPage(page: number): void { this.currentPage = page; }

  getTotalRevenue(): number {
    return this.sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  }
}
