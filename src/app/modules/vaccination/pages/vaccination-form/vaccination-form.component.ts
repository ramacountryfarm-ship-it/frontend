import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VaccinationService } from '../../services/vaccination.service';
import { BatchService } from '../../../batches/services/batch.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-vaccination-form',
  templateUrl: './vaccination-form.component.html',
  styleUrls: ['./vaccination-form.component.scss']
})
export class VaccinationFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  vaccinationId = '';
  isLoading = false;
  isSaving = false;
  batches: any[] = [];

  constructor(
    private fb: FormBuilder,
    private vaccinationService: VaccinationService,
    private batchService: BatchService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      batchId: ['', Validators.required],
      vaccineName: ['', Validators.required],
      dueDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.batchService.getAll().subscribe(data => this.batches = data);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.vaccinationId = id;
      this.isLoading = true;
      this.vaccinationService.getById(id).subscribe({
        next: (data) => {
          this.form.patchValue({
            batchId: data.batch?._id || data.batch || '',
            vaccineName: data.vaccineName || '',
            dueDate: data.dueDate ? data.dueDate.substring(0, 10) : '',
            notes: data.notes || ''
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
      ? this.vaccinationService.update(this.vaccinationId, this.form.value)
      : this.vaccinationService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Vaccination updated successfully' : 'Vaccination created successfully');
        this.router.navigate(['/vaccination']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save vaccination');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void { this.router.navigate(['/vaccination']); }
}
