import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BirdBreedService } from '../../services/bird-breed.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-breed-form',
  templateUrl: './breed-form.component.html',
  styleUrls: ['./breed-form.component.scss']
})
export class BreedFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  breedId = '';
  isLoading = false;
  isSaving = false;

  birdTypes = ['Layer', 'Broiler', 'Dual Purpose', 'Desi'];

  constructor(
    private fb: FormBuilder,
    private breedService: BirdBreedService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      breedName: ['', Validators.required],
      birdType: ['', Validators.required],
      eggsPerYear: [0, [Validators.required, Validators.min(0)]],
      feedSchedule: this.fb.array([]),
      eggLayingAgeWeeks: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get feedSchedule(): FormArray {
    return this.form.get('feedSchedule') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.breedId = id;
      this.isLoading = true;
      this.breedService.getById(id).subscribe({
        next: (data) => {
          this.form.patchValue({
            breedName: data.breedName,
            birdType: data.birdType,
            eggsPerYear: data.eggsPerYear,
            eggLayingAgeWeeks: data.eggLayingAgeWeeks
          });
          if (data.feedSchedule && data.feedSchedule.length) {
            data.feedSchedule.forEach((s: any) => {
              this.feedSchedule.push(this.createFeedRow(s.fromWeek, s.toWeek, s.feedPerDayKg));
            });
          }
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
    } else {
      // Add one default row for new breed
      this.addFeedRow();
    }
  }

  createFeedRow(fromWeek = 0, toWeek = 0, feedPerDayKg = 0): FormGroup {
    return this.fb.group({
      fromWeek: [fromWeek, [Validators.required, Validators.min(0)]],
      toWeek: [toWeek, [Validators.required, Validators.min(0)]],
      feedPerDayKg: [feedPerDayKg, [Validators.required, Validators.min(0)]]
    });
  }

  addFeedRow(): void {
    this.feedSchedule.push(this.createFeedRow());
  }

  removeFeedRow(index: number): void {
    this.feedSchedule.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill all required fields');
      return;
    }
    this.isSaving = true;
    const obs = this.isEdit
      ? this.breedService.update(this.breedId, this.form.value)
      : this.breedService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Breed updated successfully' : 'Breed created successfully');
        this.router.navigate(['/bird-breeds']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save breed');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void { this.router.navigate(['/bird-breeds']); }
}
