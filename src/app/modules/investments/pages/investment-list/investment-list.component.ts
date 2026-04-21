import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvestmentService } from '../../services/investment.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-investment-list',
  templateUrl: './investment-list.component.html',
  styleUrls: ['./investment-list.component.scss']
})
export class InvestmentListComponent implements OnInit {
  investments: any[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  showDeleteDialog = false;
  deleteId = '';
  selectedCategory = '';

  categories = ['', 'Structural', 'Feed Purchase', 'Bird Purchase', 'Medicine', 'Equipment', 'Other'];

  constructor(private investmentService: InvestmentService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.loadInvestments(); }

  loadInvestments(): void {
    this.isLoading = true;
    this.investmentService.getAll(this.selectedCategory).subscribe({
      next: (data) => { this.investments = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.loadInvestments(); }
  onAdd(): void { this.router.navigate(['/investments/new']); }
  onEdit(id: string): void { this.router.navigate(['/investments/edit', id]); }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.investmentService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Investment deleted successfully'); this.loadInvestments(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete investment'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  get totalPages(): number { return Math.ceil(this.investments.length / this.pageSize); }

  get paginatedInvestments(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.investments.slice(start, start + this.pageSize); }

  goToPage(page: number): void { this.currentPage = page; }

  getTotalAmount(): number {
    return this.investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }
}
