import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyLogService } from '../../services/daily-log.service';
import { BatchService } from '../../../batches/services/batch.service';
import { FeedService } from '../../../feed-management/services/feed.service';
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
  commercialFeeds: any[] = [];
  ownMixes: any[] = [];

  readonly feedTimes = ['morning', 'afternoon', 'evening', 'night'];
  readonly feedTimeLabels: Record<string, string> = {
    morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', night: 'Night'
  };

  constructor(
    private fb: FormBuilder,
    private logService: DailyLogService,
    private batchService: BatchService,
    private feedService: FeedService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      batchId: ['', Validators.required],
      locationId: [''],
      feedings: this.fb.array([]),
      eggsCollected: [0, [Validators.required, Validators.min(0)]],
      brokenEggs: [0, [Validators.min(0)]],
      birdDeaths: [0, [Validators.min(0)]],
      notes: ['']
    });
  }

  get feedingsArray(): FormArray { return this.form.get('feedings') as FormArray; }

  get totalFeedKg(): number {
    return this.feedingsArray.controls.reduce((sum, ctrl) => {
      return sum + (parseFloat(ctrl.get('quantityKg')?.value) || 0);
    }, 0);
  }

  get usedTimes(): string[] {
    return this.feedingsArray.controls.map(c => c.get('time')?.value).filter(Boolean);
  }

  get availableTimesForAdd(): string[] {
    return this.feedTimes.filter(t => !this.usedTimes.includes(t));
  }

  ngOnInit(): void {
    Promise.all([
      this.batchService.getAll().toPromise(),
      this.feedService.getCommercialFeeds().toPromise(),
      this.feedService.getOwnFeedMixes().toPromise()
    ]).then(([batches, commercial, ownMixes]) => {
      this.batches = batches || [];
      this.commercialFeeds = commercial || [];
      this.ownMixes = ownMixes || [];
    });

    this.form.get('batchId')?.valueChanges.subscribe(batchId => {
      const batch = this.batches.find(b => b._id === batchId);
      if (batch) {
        this.form.patchValue({ locationId: batch.location?._id || batch.location || '' });
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
            eggsCollected: data.eggsCollected || 0,
            brokenEggs: data.brokenEggs || 0,
            birdDeaths: data.birdDeaths || 0,
            notes: data.notes || ''
          });
          if (Array.isArray(data.feedings) && data.feedings.length > 0) {
            data.feedings.forEach((f: any) => this.addFeeding(f));
          }
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

  addFeeding(existing?: any): void {
    if (this.feedingsArray.length >= 4) return;
    const time = existing?.time || this.availableTimesForAdd[0] || 'morning';
    const feedType = existing?.feedType || 'commercial';
    const group = this.fb.group({
      time: [time, Validators.required],
      feedType: [feedType, Validators.required],
      commercialFeedId: [existing?.commercialFeed?._id || existing?.commercialFeed || null],
      ownFeedMixId: [existing?.ownFeedMix?._id || existing?.ownFeedMix || null],
      quantityKg: [existing?.quantityKg || '', [Validators.required, Validators.min(0.01)]]
    });
    this.feedingsArray.push(group);
  }

  removeFeeding(index: number): void {
    this.feedingsArray.removeAt(index);
  }

  setFeedType(index: number, type: string): void {
    const ctrl = this.feedingsArray.at(index);
    ctrl.patchValue({ feedType: type, commercialFeedId: null, ownFeedMixId: null });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill all required fields');
      return;
    }
    this.isSaving = true;

    const raw = this.form.value;
    const feedings = raw.feedings.map((f: any) => ({
      time: f.time,
      feedType: f.feedType,
      commercialFeed: f.feedType === 'commercial' ? f.commercialFeedId : null,
      ownFeedMix: f.feedType === 'own_mix' ? f.ownFeedMixId : null,
      quantityKg: parseFloat(f.quantityKg) || 0
    }));

    const payload = {
      date: raw.date,
      batchId: raw.batchId,
      locationId: raw.locationId,
      feedings,
      eggsCollected: raw.eggsCollected,
      brokenEggs: raw.brokenEggs,
      birdDeaths: raw.birdDeaths,
      notes: raw.notes
    };

    const obs = this.isEdit
      ? this.logService.update(this.logId, payload)
      : this.logService.create(payload);

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
