import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyLogService } from '../../services/daily-log.service';
import { BatchService } from '../../../batches/services/batch.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.scss']
})
export class LogFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  logId = '';
  isLoading = false;
  isSaving = false;
  batches: any[] = [];

  constructor(
    private fb: FormBuilder,
    private logService: DailyLogService,
    private batchService: BatchService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      batchId: ['', Validators.required],
      locationId: [''],
      feedGivenKg: [0, [Validators.required, Validators.min(0)]],
      eggsCollected: [0, [Validators.required, Validators.min(0)]],
      brokenEggs: [0, [Validators.min(0)]],
      birdDeaths: [0, [Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.batchService.getAll().subscribe(data => this.batches = data);

    this.form.get('batchId')?.valueChanges.subscribe(batchId => {
      const batch = this.batches.find(b => b._id === batchId);
      if (batch) {
        this.form.patchValue({
          locationId: batch.location?._id || batch.location || ''
        });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.logId = id;
      this.isLoading = true;
      this.logService.getById(id).subscribe({
        next: (data) => {
          this.form.patchValue({
            date: data.date ? data.date.substring(0, 10) : '',
            batchId: data.batch?._id || data.batch || '',
            locationId: data.location?._id || data.location || '',
            feedGivenKg: data.feedGivenKg || 0,
            eggsCollected: data.eggsCollected || 0,
            brokenEggs: data.brokenEggs || 0,
            birdDeaths: data.birdDeaths || 0,
            notes: data.notes || ''
          });
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
    }
  }

  getSelectedBatchLocation(): string {
    const batchId = this.form.get('batchId')?.value;
    const batch = this.batches.find(b => b._id === batchId);
    return batch?.location?.name || '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill all required fields');
      return;
    }
    this.isSaving = true;
    const obs = this.isEdit
      ? this.logService.update(this.logId, this.form.value)
      : this.logService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Daily log updated successfully' : 'Daily log recorded successfully');
        this.router.navigate(['/daily-log']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save daily log');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void { this.router.navigate(['/daily-log']); }
}
