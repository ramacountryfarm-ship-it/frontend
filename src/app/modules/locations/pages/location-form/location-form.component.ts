import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  locationId = '';
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.locationId = id;
      this.isLoading = true;
      this.locationService.getById(id).subscribe({
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
      ? this.locationService.update(this.locationId, this.form.value)
      : this.locationService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Location updated successfully' : 'Location created successfully');
        this.router.navigate(['/locations']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save location');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/locations']);
  }
}
