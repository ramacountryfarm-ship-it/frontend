import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EggTradingService } from '../../services/egg-trading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-procurement-form', templateUrl: './procurement-form.component.html', styleUrls: ['./procurement-form.component.scss'] })
export class ProcurementFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  recordId = '';
  isLoading = false;
  isSaving = false;
  farmers: any[] = [];
  units = ['pieces', 'dozens', 'trays'];
  qualities = ['Good', 'Average', 'Poor'];
  paymentStatuses = ['Paid', 'Partial', 'Pending'];

  constructor(private fb: FormBuilder, private service: EggTradingService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({
      farmer: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unit: ['dozens'],
      pricePerUnit: [null, [Validators.required, Validators.min(0)]],
      totalAmount: [{ value: 0, disabled: true }],
      brokenOnArrival: [0, Validators.min(0)],
      qualityRating: ['Good'],
      amountPaid: [0, Validators.min(0)],
      paymentStatus: ['Pending'],
      paymentDueDate: [''],
      notes: ['']
    });

    this.form.get('quantity')?.valueChanges.subscribe(() => this.calcTotal());
    this.form.get('pricePerUnit')?.valueChanges.subscribe(() => this.calcTotal());
    this.form.get('paymentStatus')?.valueChanges.subscribe(s => { if (s === 'Paid') this.form.patchValue({ amountPaid: this.form.getRawValue().totalAmount }, { emitEvent: false }); });
  }

  ngOnInit(): void {
    this.service.getFarmers().subscribe(f => this.farmers = f);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.recordId = id; this.isLoading = true;
      this.service.getProcurementById(id).subscribe({
        next: (d) => {
          this.form.patchValue({ ...d, date: d.date?.substring(0, 10), farmer: d.farmer?._id || d.farmer, paymentDueDate: d.paymentDueDate?.substring(0, 10) || '' });
          this.form.get('totalAmount')?.setValue(d.totalAmount);
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; this.router.navigate(['/egg-trading/procurement']); }
      });
    }
  }

  calcTotal(): void {
    const q = this.form.get('quantity')?.value || 0;
    const p = this.form.get('pricePerUnit')?.value || 0;
    this.form.get('totalAmount')?.setValue(parseFloat((q * p).toFixed(2)));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const payload = { ...this.form.getRawValue() };
    if (!payload.paymentDueDate) delete payload.paymentDueDate;
    const obs = this.isEdit ? this.service.updateProcurement(this.recordId, payload) : this.service.createProcurement(payload);
    obs.subscribe({ next: () => { this.toast.success(this.isEdit ? 'Updated' : 'Procurement recorded'); this.router.navigate(['/egg-trading/procurement']); }, error: (e) => { this.toast.error(e.error?.message || 'Failed to save'); this.isSaving = false; } });
  }

  onCancel(): void { this.router.navigate(['/egg-trading/procurement']); }
}
