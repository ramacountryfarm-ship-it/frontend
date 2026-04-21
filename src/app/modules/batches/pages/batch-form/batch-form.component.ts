import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchService } from '../../services/batch.service';
import { LocationService } from '../../../locations/services/location.service';
import { BirdBreedService } from '../../../bird-breeds/services/bird-breed.service';
import { VendorService } from '../../../vendors/services/vendor.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-batch-form',
  templateUrl: './batch-form.component.html',
  styleUrls: ['./batch-form.component.scss']
})
export class BatchFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  batchId = '';
  isLoading = false;
  isSaving = false;
  locations: any[] = [];
  breeds: any[] = [];
  vendors: any[] = [];

  genders = ['Male', 'Female', 'Mixed'];

  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private locationService: LocationService,
    private breedService: BirdBreedService,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      batchName: ['', Validators.required],
      locationId: ['', Validators.required],
      breedId: ['', Validators.required],
      gender: ['Female', Validators.required],
      purchaseDate: ['', Validators.required],
      initialCount: [0, [Validators.required, Validators.min(1)]],
      femaleCount: [0],
      maleCount: [0],
      costPerBird: [0],
      femaleCostPerBird: [0],
      maleCostPerBird: [0],
      vendorId: [''],
      notes: ['']
    });
  }

  get isMixed(): boolean {
    return this.form.get('gender')?.value === 'Mixed';
  }

  ngOnInit(): void {
    this.locationService.getAll().subscribe(data => this.locations = data);
    this.breedService.getAll().subscribe(data => this.breeds = data);
    this.vendorService.getAll().subscribe(data => this.vendors = data.filter((v: any) => v.vendorType === 'Bird Supplier' || !v.vendorType));

    // When gender changes to Mixed, auto-update initial count from female+male
    this.form.get('gender')?.valueChanges.subscribe(() => {
      if (this.isMixed) {
        this.updateMixedTotal();
      }
    });
    this.form.get('femaleCount')?.valueChanges.subscribe(() => {
      if (this.isMixed) this.updateMixedTotal();
    });
    this.form.get('maleCount')?.valueChanges.subscribe(() => {
      if (this.isMixed) this.updateMixedTotal();
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.batchId = id;
      this.isLoading = true;
      this.batchService.getById(id).subscribe({
        next: (data) => {
          this.form.patchValue({
            batchName: data.batchName,
            locationId: data.location?._id || data.location || '',
            breedId: data.breed?._id || data.breed || '',
            gender: data.gender,
            purchaseDate: data.purchaseDate ? data.purchaseDate.substring(0, 10) : '',
            initialCount: data.initialBirdCount || 0,
            femaleCount: data.femaleCount || 0,
            maleCount: data.maleCount || 0,
            costPerBird: data.birdPurchasePrice || 0,
            femaleCostPerBird: data.femaleCostPerBird || 0,
            maleCostPerBird: data.maleCostPerBird || 0,
            vendorId: data.vendor?._id || data.vendor || '',
            notes: data.notes || ''
          });
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
    }
  }

  private updateMixedTotal(): void {
    const female = this.form.get('femaleCount')?.value || 0;
    const male = this.form.get('maleCount')?.value || 0;
    this.form.patchValue({ initialCount: female + male }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill all required fields');
      return;
    }
    this.isSaving = true;
    const obs = this.isEdit
      ? this.batchService.update(this.batchId, this.form.value)
      : this.batchService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Batch updated successfully' : 'Batch created successfully');
        this.router.navigate(['/batches']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save batch');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void { this.router.navigate(['/batches']); }
}
