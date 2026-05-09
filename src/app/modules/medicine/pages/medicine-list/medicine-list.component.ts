import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicineService } from '../../services/medicine.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss']
})
export class MedicineListComponent implements OnInit {
  medicines: any[] = [];
  isLoading = true;
  showForm = false;
  editingId = '';
  isSaving = false;
  form: FormGroup;
  showDeleteDialog = false;
  deleteId = '';

  filterType = '';

  types = ['Supplement', 'Vaccine', 'Antibiotic', 'Dewormer', 'Other'];
  units = ['ml', 'g', 'tablet', 'sachet', 'bottle', 'vial'];

  constructor(private fb: FormBuilder, private service: MedicineService, private toast: ToastService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['Supplement', Validators.required],
      unit: ['ml', Validators.required],
      pricePerUnit: [0, Validators.min(0)],
      stockQuantity: [0, Validators.min(0)],
      notes: ['']
    });
  }

  get filtered(): any[] {
    if (!this.filterType) return this.medicines;
    return this.medicines.filter(m => m.type === this.filterType);
  }

  get typeBadgeClass(): (type: string) => string {
    return (type: string) => {
      const map: Record<string, string> = {
        Supplement: 'bg-blue-100 text-blue-700',
        Vaccine: 'bg-green-100 text-green-700',
        Antibiotic: 'bg-red-100 text-red-700',
        Dewormer: 'bg-amber-100 text-amber-700',
        Other: 'bg-gray-100 text-gray-700'
      };
      return map[type] || 'bg-gray-100 text-gray-700';
    };
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (d) => { this.medicines = d; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onAdd(): void {
    this.editingId = '';
    this.form.reset({ type: 'Supplement', unit: 'ml', pricePerUnit: 0, stockQuantity: 0 });
    this.showForm = true;
  }

  onEdit(m: any): void {
    this.editingId = m._id;
    this.form.patchValue({
      name: m.name,
      type: m.type,
      unit: m.unit,
      pricePerUnit: m.pricePerUnit,
      stockQuantity: m.stockQuantity,
      notes: m.notes || ''
    });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    const obs = this.editingId
      ? this.service.update(this.editingId, this.form.value)
      : this.service.create(this.form.value);
    obs.subscribe({
      next: () => {
        this.toast.success(this.editingId ? 'Medicine updated' : 'Medicine added');
        this.isSaving = false;
        this.showForm = false;
        this.editingId = '';
        this.load();
      },
      error: () => { this.isSaving = false; this.toast.error('Failed to save'); }
    });
  }

  onDeleteClick(id: string): void { this.deleteId = id; this.showDeleteDialog = true; }

  onDeleteConfirm(): void {
    this.service.delete(this.deleteId).subscribe({
      next: () => { this.showDeleteDialog = false; this.toast.success('Deleted'); this.load(); },
      error: () => { this.showDeleteDialog = false; this.toast.error('Failed to delete'); }
    });
  }

  totalStockValue(): number {
    return this.medicines.reduce((s, m) => s + (m.stockQuantity || 0) * (m.pricePerUnit || 0), 0);
  }

  countByType(type: string): number {
    return this.medicines.filter(m => m.type === type).length;
  }
}
