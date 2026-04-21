import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  vendorId = '';
  isLoading = false;
  isSaving = false;

  vendorTypes = ['Feed Supplier', 'Medicine Supplier', 'Equipment Supplier', 'Bird Supplier', 'Contractor', 'Other'];

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      vendorType: ['', Validators.required],
      phone: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.vendorId = id;
      this.isLoading = true;
      this.vendorService.getById(id).subscribe({
        next: (data) => { this.form.patchValue(data); this.isLoading = false; },
        error: () => { this.isLoading = false; }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill all required fields');
      return;
    }
    this.isSaving = true;
    const obs = this.isEdit
      ? this.vendorService.update(this.vendorId, this.form.value)
      : this.vendorService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Vendor updated successfully' : 'Vendor created successfully');
        this.router.navigate(['/vendors']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save vendor');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void { this.router.navigate(['/vendors']); }
}
