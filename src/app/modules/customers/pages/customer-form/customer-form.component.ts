import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  customerId = '';
  isLoading = false;
  isSaving = false;

  types = ['Individual', 'Retail', 'Wholesale', 'Hotel', 'Restaurant'];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      address: ['', Validators.required],
      type: ['Individual', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.customerId = id;
      this.isLoading = true;
      this.customerService.getById(id).subscribe({
        next: (data) => { this.form.patchValue(data); this.isLoading = false; },
        error: () => { this.isLoading = false; this.router.navigate(['/customers']); }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const obs = this.isEdit
      ? this.customerService.update(this.customerId, this.form.value)
      : this.customerService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Customer updated' : 'Customer added');
        this.router.navigate(['/customers']);
      },
      error: (err) => { this.toast.error(err.error?.message || 'Failed to save'); this.isSaving = false; }
    });
  }

  onCancel(): void { this.router.navigate(['/customers']); }
}
