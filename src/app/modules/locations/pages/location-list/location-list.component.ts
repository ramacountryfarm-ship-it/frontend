import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  locations: any[] = [];
  isLoading = true;
  showDeleteDialog = false;
  deleteId = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private locationService: LocationService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.isLoading = true;
    this.locationService.getAll().subscribe({
      next: (data) => { this.locations = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get totalPages(): number { return Math.ceil(this.locations.length / this.pageSize); }

  get paginatedLocations(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.locations.slice(start, start + this.pageSize); }

  goToPage(page: number): void { this.currentPage = page; }

  onAdd(): void {
    this.router.navigate(['/locations/new']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/locations/edit', id]);
  }

  onDeleteClick(id: string): void {
    this.deleteId = id;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    this.locationService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Location deleted successfully'); this.loadLocations(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete location'); }
    });
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
  }
}
