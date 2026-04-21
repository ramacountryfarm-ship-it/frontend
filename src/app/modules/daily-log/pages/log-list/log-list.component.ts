import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyLogService } from '../../services/daily-log.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
  logs: any[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  showDeleteDialog = false;
  deleteId = '';
  dateFrom = '';
  dateTo = '';

  get totalPages(): number { return Math.ceil(this.logs.length / this.pageSize); }

  get paginatedLogs(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.logs.slice(start, start + this.pageSize); }

  constructor(private logService: DailyLogService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.loadLogs(); }

  loadLogs(): void {
    this.isLoading = true;
    this.logService.getAll(this.dateFrom, this.dateTo).subscribe({
      next: (data) => { this.logs = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.loadLogs(); }

  onAdd(): void { this.router.navigate(['/daily-log/new']); }
  onEdit(id: string): void { this.router.navigate(['/daily-log/edit', id]); }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.logService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Daily log deleted successfully'); this.loadLogs(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete daily log'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  goToPage(page: number): void { this.currentPage = page; }
}
