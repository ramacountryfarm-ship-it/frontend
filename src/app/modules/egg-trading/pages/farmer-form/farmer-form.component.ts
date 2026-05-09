import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EggTradingService } from '../../services/egg-trading.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({ selector: 'app-farmer-form', templateUrl: './farmer-form.component.html', styleUrls: ['./farmer-form.component.scss'] })
export class FarmerFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  farmerId = '';
  isLoading = false;
  isSaving = false;
  paymentTerms = ['Cash', 'Weekly', 'Monthly'];

  constructor(private fb: FormBuilder, private service: EggTradingService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({ name: ['', Validators.required], phone: [''], address: [''], village: [''], preferredPaymentTerms: ['Cash'], notes: [''] });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.farmerId = id; this.isLoading = true;
      this.service.getFarmerById(id).subscribe({ next: (d) => { this.form.patchValue(d.farmer || d); this.isLoading = false; }, error: () => { this.isLoading = false; this.router.navigate(['/egg-trading/farmers']); } });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const obs = this.isEdit ? this.service.updateFarmer(this.farmerId, this.form.value) : this.service.createFarmer(this.form.value);
    obs.subscribe({ next: () => { this.toast.success(this.isEdit ? 'Farmer updated' : 'Farmer added'); this.router.navigate(['/egg-trading/farmers']); }, error: (e) => { this.toast.error(e.error?.message || 'Failed to save'); this.isSaving = false; } });
  }

  onCancel(): void { this.router.navigate(['/egg-trading/farmers']); }
}
