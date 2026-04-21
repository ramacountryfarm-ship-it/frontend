import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BirdBreedService } from '../../services/bird-breed.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-breed-list',
  templateUrl: './breed-list.component.html',
  styleUrls: ['./breed-list.component.scss']
})
export class BreedListComponent implements OnInit {
  breeds: any[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  showDeleteDialog = false;
  deleteId = '';

  get totalPages(): number { return Math.ceil(this.breeds.length / this.pageSize); }

  get paginatedBreeds(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.breeds.slice(start, start + this.pageSize); }

  constructor(private breedService: BirdBreedService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadBreeds();
  }

  loadBreeds(): void {
    this.isLoading = true;
    this.breedService.getAll().subscribe({
      next: (data) => { this.breeds = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onAdd(): void { this.router.navigate(['/bird-breeds/new']); }
  onEdit(id: string): void { this.router.navigate(['/bird-breeds/edit', id]); }

  onDeleteClick(id: string): void {
    this.deleteId = id;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    this.breedService.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Breed deleted successfully'); this.loadBreeds(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete breed'); }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }

  goToPage(page: number): void { this.currentPage = page; }
}
