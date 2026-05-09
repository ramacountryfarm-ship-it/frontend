import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EggTradingService } from '../../services/egg-trading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-procurement-list', templateUrl: './procurement-list.component.html', styleUrls: ['./procurement-list.component.scss'] })
export class ProcurementListComponent implements OnInit {
  data: any = { records: [], totalCost: 0, totalEggs: 0, totalPending: 0 };
  farmers: any[] = [];
  isLoading = true;
  showDeleteDialog = false;
  deleteId = '';
  selectedFarmer = '';
  selectedPayment = '';
  startDate = '';
  endDate = '';
  currentPage = 1;
  pageSize = 10;
  paymentStatuses = ['', 'Paid', 'Partial', 'Pending'];

  constructor(private service: EggTradingService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.service.getFarmers().subscribe(f => this.farmers = f);
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.service.getProcurement({ farmer: this.selectedFarmer, paymentStatus: this.selectedPayment, startDate: this.startDate, endDate: this.endDate }).subscribe({
      next: (d) => { this.data = d; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.load(); }
  onAdd(): void { this.router.navigate(['/egg-trading/procurement/new']); }
  onEdit(id: string): void { this.router.navigate(['/egg-trading/procurement/edit', id]); }
  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }
  onDeleteCancel(): void { this.showDeleteDialog = false; }
  onDeleteConfirm(): void {
    this.service.deleteProcurement(this.deleteId).subscribe({ next: () => { this.showDeleteDialog = false; this.toast.success('Deleted'); this.load(); }, error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete'); } });
  }

  paymentBadgeClass(status: string): string {
    return status === 'Paid' ? 'bg-green-100 text-green-700' : status === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  }

  qualityBadgeClass(q: string): string {
    return q === 'Good' ? 'bg-green-100 text-green-700' : q === 'Average' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  }

  get totalPages(): number { return Math.ceil((this.data.records?.length || 0) / this.pageSize); }
  get paginated(): any[] { return (this.data.records || []).slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize); }
  goToPage(p: number): void { this.currentPage = p; }
}
