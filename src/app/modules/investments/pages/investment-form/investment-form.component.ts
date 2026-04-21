import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentService } from '../../services/investment.service';
import { VendorService } from '../../../vendors/services/vendor.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-investment-form',
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.scss']
})
export class InvestmentFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  investmentId = '';
  isLoading = false;
  isSaving = false;
  vendors: any[] = [];

  categories = ['Structural', 'Feed Purchase', 'Bird Purchase', 'Medicine', 'Equipment', 'Other'];

  constructor(
    private fb: FormBuilder,
    private investmentService: InvestmentService,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      category: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      vendorId: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.vendorService.getAll().subscribe(data => this.vendors = data);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.investmentId = id;
      this.isLoading = true;
      this.investmentService.getById(id).subscribe({
        next: (data) => {
          this.form.patchValue({
            ...data,
            vendorId: data.vendorId?._id || data.vendorId || '',
            date: data.date ? data.date.substring(0, 10) : ''
          });
          this.isLoading = false;
        },
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
      ? this.investmentService.update(this.investmentId, this.form.value)
      : this.investmentService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Investment updated successfully' : 'Investment recorded successfully');
        this.router.navigate(['/investments']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save investment');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void { this.router.navigate(['/investments']); }
}
