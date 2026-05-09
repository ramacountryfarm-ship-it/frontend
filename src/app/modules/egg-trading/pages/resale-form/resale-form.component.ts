import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EggTradingService } from '../../services/egg-trading.service';
import { CustomerService } from '../../../customers/services/customer.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-resale-form', templateUrl: './resale-form.component.html', styleUrls: ['./resale-form.component.scss'] })
export class ResaleFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  recordId = '';
  isLoading = false;
  isSaving = false;
  customers: any[] = [];
  units = ['pieces', 'dozens', 'trays'];
  paymentStatuses = ['Paid', 'Partial', 'Pending'];

  constructor(private fb: FormBuilder, private service: EggTradingService, private customerService: CustomerService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({
      customer: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unit: ['dozens'],
      pricePerUnit: [null, [Validators.required, Validators.min(0)]],
      totalAmount: [{ value: 0, disabled: true }],
      amountReceived: [0, Validators.min(0)],
      paymentStatus: ['Paid'],
      paymentDueDate: [''],
      deliveryAddress: [''],
      notes: ['']
    });

    this.form.get('quantity')?.valueChanges.subscribe(() => this.calcTotal());
    this.form.get('pricePerUnit')?.valueChanges.subscribe(() => this.calcTotal());
    this.form.get('customer')?.valueChanges.subscribe(id => {
      const cust = this.customers.find(c => c._id === id);
      if (cust && !this.form.get('deliveryAddress')?.value) {
        this.form.patchValue({ deliveryAddress: cust.address }, { emitEvent: false });
      }
    });
    this.form.get('paymentStatus')?.valueChanges.subscribe(s => { if (s === 'Paid') this.form.patchValue({ amountReceived: this.form.getRawValue().totalAmount }, { emitEvent: false }); });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(c => this.customers = c);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.recordId = id; this.isLoading = true;
      this.service.getResaleById(id).subscribe({
        next: (d) => {
          this.form.patchValue({ ...d, date: d.date?.substring(0, 10), customer: d.customer?._id || d.customer, paymentDueDate: d.paymentDueDate?.substring(0, 10) || '' });
          this.form.get('totalAmount')?.setValue(d.totalAmount);
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; this.router.navigate(['/egg-trading/resale']); }
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
    const obs = this.isEdit ? this.service.updateResale(this.recordId, payload) : this.service.createResale(payload);
    obs.subscribe({ next: () => { this.toast.success(this.isEdit ? 'Updated' : 'Sale recorded'); this.router.navigate(['/egg-trading/resale']); }, error: (e) => { this.toast.error(e.error?.message || 'Failed to save'); this.isSaving = false; } });
  }

  onCancel(): void { this.router.navigate(['/egg-trading/resale']); }
}
