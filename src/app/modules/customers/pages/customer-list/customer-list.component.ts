import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  isLoading = true;
  showDeleteDialog = false;
  deleteId = '';
  selectedType = '';
  searchText = '';
  currentPage = 1;
  pageSize = 10;

  types = ['', 'Retail', 'Wholesale', 'Hotel', 'Restaurant', 'Individual'];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.loadCustomers(); }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getAll(this.selectedType, this.searchText).subscribe({
      next: (data) => { this.customers = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.loadCustomers(); }
  onAdd(): void { this.router.navigate(['/customers/new']); }
  onEdit(id: string): void { this.router.navigate(['/customers/edit', id]); }
  onView(id: string): void { this.router.navigate(['/customers', id]); }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }
  onDeleteCancel(): void { this.showDeleteDialog = false; }

  onDeleteConfirm(): void {
    this.customerService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Customer deleted'); this.loadCustomers(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete customer'); }
    });
  }

  get totalPages(): number { return Math.ceil(this.customers.length / this.pageSize); }
  get paginatedCustomers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.customers.slice(start, start + this.pageSize);
  }
  goToPage(page: number): void { this.currentPage = page; }

  typeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      'Wholesale': 'bg-blue-100 text-blue-700',
      'Hotel': 'bg-purple-100 text-purple-700',
      'Restaurant': 'bg-orange-100 text-orange-700',
      'Retail': 'bg-green-100 text-green-700',
      'Individual': 'bg-gray-100 text-gray-600',
    };
    return map[type] || 'bg-gray-100 text-gray-600';
  }
}
