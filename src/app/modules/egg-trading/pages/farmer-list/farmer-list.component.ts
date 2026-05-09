import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggTradingService } from '../../services/egg-trading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-farmer-list', templateUrl: './farmer-list.component.html', styleUrls: ['./farmer-list.component.scss'] })
export class FarmerListComponent implements OnInit {
  farmers: any[] = [];
  isLoading = true;
  showDeleteDialog = false;
  deleteId = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private service: EggTradingService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.service.getFarmers().subscribe({ next: (d) => { this.farmers = d; this.isLoading = false; }, error: () => { this.isLoading = false; } });
  }

  onAdd(): void { this.router.navigate(['/egg-trading/farmers/new']); }
  onEdit(id: string): void { this.router.navigate(['/egg-trading/farmers/edit', id]); }
  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }
  onDeleteCancel(): void { this.showDeleteDialog = false; }
  onDeleteConfirm(): void {
    this.service.deleteFarmer(this.deleteId).subscribe({ next: () => { this.showDeleteDialog = false; this.toast.success('Farmer deleted'); this.load(); }, error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete'); } });
  }

  get totalPages(): number { return Math.ceil(this.farmers.length / this.pageSize); }
  get paginated(): any[] { return this.farmers.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize); }
  goToPage(p: number): void { this.currentPage = p; }
}
