import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VaccinationService } from '../../services/vaccination.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-vaccination-list',
  templateUrl: './vaccination-list.component.html',
  styleUrls: ['./vaccination-list.component.scss']
})
export class VaccinationListComponent implements OnInit {
  vaccinations: any[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  showDeleteDialog = false;
  deleteId = '';
  statusFilter = '';

  constructor(private vaccinationService: VaccinationService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.loadVaccinations(); }

  loadVaccinations(): void {
    this.isLoading = true;
    this.vaccinationService.getAll(this.statusFilter).subscribe({
      next: (data) => { this.vaccinations = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.loadVaccinations(); }
  onAdd(): void { this.router.navigate(['/vaccination/new']); }
  onEdit(id: string): void { this.router.navigate(['/vaccination/edit', id]); }

  onToggle(id: string): void {
    this.vaccinationService.toggleStatus(id).subscribe({
      next: () => { this.loadVaccinations(); },
      error: () => {}
    });
  }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.vaccinationService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Vaccination deleted successfully'); this.loadVaccinations(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete vaccination'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  get totalPages(): number { return Math.ceil(this.vaccinations.length / this.pageSize); }

  get paginatedVaccinations(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.vaccinations.slice(start, start + this.pageSize); }

  goToPage(page: number): void { this.currentPage = page; }

  isOverdue(dueDate: string, completed: boolean | string): boolean {
    if (completed === true || completed === 'Completed') return false;
    return new Date(dueDate) < new Date();
  }
}
