import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BatchService } from '../../services/batch.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {
  batches: any[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  get totalPages(): number { return Math.ceil(this.batches.length / this.pageSize); }

  get paginatedBatches(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.batches.slice(start, start + this.pageSize);
  }
  showDeleteDialog = false;
  deleteId = '';

  constructor(private batchService: BatchService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.loadBatches(); }

  loadBatches(): void {
    this.isLoading = true;
    this.batchService.getAll().subscribe({
      next: (data) => { this.batches = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onAdd(): void { this.router.navigate(['/batches/new']); }
  onEdit(id: string): void { this.router.navigate(['/batches/edit', id]); }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.batchService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Batch deleted successfully'); this.loadBatches(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete batch'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  goToPage(page: number): void { this.currentPage = page; }
}
