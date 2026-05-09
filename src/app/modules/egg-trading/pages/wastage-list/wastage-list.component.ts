import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EggTradingService } from '../../services/egg-trading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-wastage-list', templateUrl: './wastage-list.component.html', styleUrls: ['./wastage-list.component.scss'] })
export class WastageListComponent implements OnInit {
  data: any = { records: [], totalWasted: 0 };
  isLoading = true;
  showForm = false;
  isSaving = false;
  showDeleteDialog = false;
  deleteId = '';
  editId = '';
  form: FormGroup;
  reasons = ['Broken', 'Expired', 'Damaged in storage', 'Other'];

  constructor(private service: EggTradingService, private fb: FormBuilder, private toast: ToastService) {
    this.form = this.fb.group({ date: [new Date().toISOString().substring(0, 10), Validators.required], quantity: [null, [Validators.required, Validators.min(1)]], reason: ['Broken', Validators.required], notes: [''] });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.service.getWastage().subscribe({ next: (d) => { this.data = d; this.isLoading = false; }, error: () => { this.isLoading = false; } });
  }

  onAddClick(): void { this.editId = ''; this.form.reset({ date: new Date().toISOString().substring(0, 10), reason: 'Broken', quantity: null, notes: '' }); this.showForm = true; }

  onEditClick(r: any): void { this.editId = r._id; this.form.patchValue({ ...r, date: r.date?.substring(0, 10) }); this.showForm = true; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    const obs = this.editId ? this.service.updateWastage(this.editId, this.form.value) : this.service.createWastage(this.form.value);
    obs.subscribe({ next: () => { this.toast.success(this.editId ? 'Updated' : 'Wastage logged'); this.showForm = false; this.isSaving = false; this.load(); }, error: () => { this.toast.error('Failed to save'); this.isSaving = false; } });
  }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }
  onDeleteCancel(): void { this.showDeleteDialog = false; }
  onDeleteConfirm(): void { this.service.deleteWastage(this.deleteId).subscribe({ next: () => { this.showDeleteDialog = false; this.toast.success('Deleted'); this.load(); }, error: () => { this.showDeleteDialog = false; } }); }
}
