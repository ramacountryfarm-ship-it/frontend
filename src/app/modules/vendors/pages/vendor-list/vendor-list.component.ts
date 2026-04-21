import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
  vendors: any[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  get totalPages(): number { return Math.ceil(this.vendors.length / this.pageSize); }

  get paginatedVendors(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.vendors.slice(start, start + this.pageSize);
  }
  showDeleteDialog = false;
  deleteId = '';

  constructor(private vendorService: VendorService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.loadVendors(); }

  loadVendors(): void {
    this.isLoading = true;
    this.vendorService.getAll().subscribe({
      next: (data) => { this.vendors = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onAdd(): void { this.router.navigate(['/vendors/new']); }
  onEdit(id: string): void { this.router.navigate(['/vendors/edit', id]); }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.vendorService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Vendor deleted successfully'); this.loadVendors(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete vendor'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  goToPage(page: number): void { this.currentPage = page; }
}
