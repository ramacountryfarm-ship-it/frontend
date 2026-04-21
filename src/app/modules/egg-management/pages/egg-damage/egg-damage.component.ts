import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EggService } from '../../services/egg.service';
import { BatchService } from '../../../batches/services/batch.service';

@Component({
  selector: 'app-egg-damage',
  templateUrl: './egg-damage.component.html',
  styleUrls: ['./egg-damage.component.scss']
})
export class EggDamageComponent implements OnInit {
  damages: any[] = [];
  batches: any[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  showForm = false;
  isSaving = false;
  form: FormGroup;
  showDeleteDialog = false;
  deleteId = '';

  reasons = ['Cracked', 'Thin shell', 'Handling', 'Transport', 'Pest', 'Other'];

  constructor(
    private fb: FormBuilder,
    private eggService: EggService,
    private batchService: BatchService
  ) {
    this.form = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      batchId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      notes: ['']
    });
  }

  get totalPages(): number { return Math.ceil(this.damages.length / this.pageSize); }

  get paginatedDamages(): any[] { const start = (this.currentPage - 1) * this.pageSize; return this.damages.slice(start, start + this.pageSize); }

  goToPage(page: number): void { this.currentPage = page; }

  ngOnInit(): void {
    this.batchService.getAll().subscribe(data => this.batches = data);
    this.loadDamages();
  }

  loadDamages(): void {
    this.isLoading = true;
    this.eggService.getDamages().subscribe({
      next: (data) => { this.damages = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    this.eggService.createDamage(this.form.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.form.reset({ date: new Date().toISOString().substring(0, 10) });
        this.loadDamages();
      },
      error: () => { this.isSaving = false; }
    });
  }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.eggService.deleteDamage(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.loadDamages(); },
      error: () => { this.showDeleteDialog = false; }
    });
  }

  onDeleteCancel(): void { this.showDeleteDialog = false; }
}
