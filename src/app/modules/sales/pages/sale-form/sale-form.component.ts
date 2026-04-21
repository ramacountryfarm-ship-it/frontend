import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { BatchService } from '../../../batches/services/batch.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  saleId = '';
  isLoading = false;
  isSaving = false;
  batches: any[] = [];
  customerTypes: string[] = ['Wholesale', 'Retail', 'Direct', 'Restaurant', 'Other'];
  existingCustomerTypes: string[] = [];
  useCustomType = false;

  productTypes = ['Eggs', 'Birds', 'Meat'];

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private batchService: BatchService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      productType: ['Eggs', Validators.required],
      batchId: [''],
      quantity: [0],
      weightKg: [0],
      pricePerUnit: [0, [Validators.required, Validators.min(0)]],
      totalAmount: [0],
      customerType: [''],
      customerName: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.batchService.getAll().subscribe(data => this.batches = data);
    this.saleService.getCustomerTypes().subscribe({
      next: (types) => { this.existingCustomerTypes = types; },
      error: () => {}
    });

    // Auto-calculate total
    this.form.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.form.get('pricePerUnit')?.valueChanges.subscribe(() => this.calculateTotal());
    this.form.get('weightKg')?.valueChanges.subscribe(() => this.calculateTotal());

    // When product type changes, reset irrelevant fields
    this.form.get('productType')?.valueChanges.subscribe((type) => {
      if (type === 'Eggs') {
        this.form.patchValue({ weightKg: 0, batchId: '' }, { emitEvent: false });
      } else if (type === 'Meat') {
        this.form.patchValue({ quantity: 0 }, { emitEvent: false });
      }
      this.calculateTotal();
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.saleId = id;
      this.isLoading = true;
      this.saleService.getById(id).subscribe({
        next: (data) => {
          this.form.patchValue({
            ...data,
            batchId: data.batchId?._id || data.batchId || '',
            date: data.date ? data.date.substring(0, 10) : ''
          });
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
    }
  }

  get isEggs(): boolean {
    return this.form.get('productType')?.value === 'Eggs';
  }

  get isBirds(): boolean {
    return this.form.get('productType')?.value === 'Birds';
  }

  get isMeat(): boolean {
    return this.form.get('productType')?.value === 'Meat';
  }

  get showBatch(): boolean {
    const type = this.form.get('productType')?.value;
    return type === 'Birds' || type === 'Meat';
  }

  private calculateTotal(): void {
    const type = this.form.get('productType')?.value;
    const price = this.form.get('pricePerUnit')?.value || 0;

    let total = 0;
    if (type === 'Eggs') {
      // Eggs: quantity * price per egg
      const qty = this.form.get('quantity')?.value || 0;
      total = qty * price;
    } else if (type === 'Birds') {
      // Birds: weight(kg) * price per kg
      const weight = this.form.get('weightKg')?.value || 0;
      total = weight * price;
    } else if (type === 'Meat') {
      // Meat: weight(kg) * price per kg
      const weight = this.form.get('weightKg')?.value || 0;
      total = weight * price;
    }
    this.form.patchValue({ totalAmount: Math.round(total * 100) / 100 }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill all required fields');
      return;
    }
    this.isSaving = true;
    const obs = this.isEdit
      ? this.saleService.update(this.saleId, this.form.value)
      : this.saleService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Sale updated successfully' : 'Sale recorded successfully');
        this.router.navigate(['/sales']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save sale');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void { this.router.navigate(['/sales']); }
}
