import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedService } from '../../services/feed.service';
import { VendorService } from '../../../vendors/services/vendor.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss']
})
export class FeedListComponent implements OnInit {
  activeTab: 'commercial' | 'ownmix' = 'commercial';

  // Commercial
  commercialFeeds: any[] = [];
  vendors: any[] = [];
  showCommercialForm = false;
  editingCommercialId = '';
  isSavingCommercial = false;
  commercialForm: FormGroup;
  showDeleteCommercialDialog = false;
  deleteCommercialId = '';

  // Own Mix
  ownMixes: any[] = [];
  showMixForm = false;
  editingMixId = '';
  isSavingMix = false;
  mixForm: FormGroup;
  showDeleteMixDialog = false;
  deleteMixId = '';

  isLoading = true;

  units = ['kg', 'g', 'bags', 'liters'];

  constructor(
    private fb: FormBuilder,
    private feedService: FeedService,
    private vendorService: VendorService,
    private toast: ToastService,
    private router: Router
  ) {
    this.commercialForm = this.fb.group({
      feedName: ['', Validators.required],
      brand: [''],
      pricePerKg: [0, [Validators.required, Validators.min(0)]],
      stockKg: [0, Validators.min(0)],
      vendor: [''],
      notes: ['']
    });

    this.mixForm = this.fb.group({
      mixName: ['', Validators.required],
      notes: [''],
      ingredients: this.fb.array([])
    });
  }

  get ingredients(): FormArray {
    return this.mixForm.get('ingredients') as FormArray;
  }

  get totalMixWeight(): number {
    return this.ingredients.controls.reduce((s, c) => s + (c.get('quantityKg')?.value || 0), 0);
  }

  get totalMixCost(): number {
    return this.ingredients.controls.reduce((s, c) => {
      const qty = c.get('quantityKg')?.value || 0;
      const price = c.get('pricePerKg')?.value || 0;
      return s + qty * price;
    }, 0);
  }

  get costPerKg(): number {
    return this.totalMixWeight > 0 ? this.totalMixCost / this.totalMixWeight : 0;
  }

  ngOnInit(): void {
    this.vendorService.getAll().subscribe({ next: (v) => this.vendors = v, error: () => {} });
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    Promise.all([
      this.feedService.getCommercialFeeds().toPromise(),
      this.feedService.getOwnFeedMixes().toPromise()
    ]).then(([commercial, mixes]) => {
      this.commercialFeeds = commercial || [];
      this.ownMixes = mixes || [];
      this.isLoading = false;
    }).catch(() => { this.isLoading = false; });
  }

  // ── Commercial ──

  onAddCommercial(): void {
    this.editingCommercialId = '';
    this.commercialForm.reset({ pricePerKg: 0, stockKg: 0 });
    this.showCommercialForm = true;
  }

  onEditCommercial(f: any): void {
    this.editingCommercialId = f._id;
    this.commercialForm.patchValue({
      feedName: f.feedName,
      brand: f.brand || '',
      pricePerKg: f.pricePerKg,
      stockKg: f.stockKg,
      vendor: f.vendor?._id || f.vendor || '',
      notes: f.notes || ''
    });
    this.showCommercialForm = true;
  }

  onSubmitCommercial(): void {
    if (this.commercialForm.invalid) return;
    this.isSavingCommercial = true;
    const obs = this.editingCommercialId
      ? this.feedService.updateCommercialFeed(this.editingCommercialId, this.commercialForm.value)
      : this.feedService.createCommercialFeed(this.commercialForm.value);
    obs.subscribe({
      next: () => {
        this.toast.success(this.editingCommercialId ? 'Feed updated' : 'Feed added');
        this.isSavingCommercial = false;
        this.showCommercialForm = false;
        this.loadAll();
      },
      error: () => { this.isSavingCommercial = false; this.toast.error('Failed to save'); }
    });
  }

  onDeleteCommercialClick(id: string): void { this.deleteCommercialId = id; this.showDeleteCommercialDialog = true; }

  onDeleteCommercialConfirm(): void {
    this.feedService.deleteCommercialFeed(this.deleteCommercialId).subscribe({
      next: () => { this.showDeleteCommercialDialog = false; this.toast.success('Feed deleted'); this.loadAll(); },
      error: () => { this.showDeleteCommercialDialog = false; this.toast.error('Failed to delete'); }
    });
  }

  // ── Own Mix ──

  newIngredientRow(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantityKg: [0, [Validators.required, Validators.min(0.01)]],
      pricePerKg: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onAddMix(): void {
    this.editingMixId = '';
    this.ingredients.clear();
    this.mixForm.reset({ mixName: '' });
    this.addIngredient();
    this.showMixForm = true;
  }

  onEditMix(mix: any): void {
    this.editingMixId = mix._id;
    this.ingredients.clear();
    this.mixForm.patchValue({ mixName: mix.mixName, notes: mix.notes || '' });
    (mix.ingredients || []).forEach((ing: any) => {
      this.ingredients.push(this.fb.group({
        name: [ing.name, Validators.required],
        quantityKg: [ing.quantityKg, [Validators.required, Validators.min(0.01)]],
        pricePerKg: [ing.pricePerKg, [Validators.required, Validators.min(0)]]
      }));
    });
    if (this.ingredients.length === 0) this.addIngredient();
    this.showMixForm = true;
  }

  addIngredient(): void {
    this.ingredients.push(this.newIngredientRow());
  }

  removeIngredient(i: number): void {
    if (this.ingredients.length > 1) this.ingredients.removeAt(i);
  }

  onSubmitMix(): void {
    if (this.mixForm.invalid) return;
    this.isSavingMix = true;
    const obs = this.editingMixId
      ? this.feedService.updateOwnFeedMix(this.editingMixId, this.mixForm.value)
      : this.feedService.createOwnFeedMix(this.mixForm.value);
    obs.subscribe({
      next: () => {
        this.toast.success(this.editingMixId ? 'Mix updated' : 'Mix created');
        this.isSavingMix = false;
        this.showMixForm = false;
        this.loadAll();
      },
      error: () => { this.isSavingMix = false; this.toast.error('Failed to save mix'); }
    });
  }

  onDeleteMixClick(id: string): void { this.deleteMixId = id; this.showDeleteMixDialog = true; }

  onDeleteMixConfirm(): void {
    this.feedService.deleteOwnFeedMix(this.deleteMixId).subscribe({
      next: () => { this.showDeleteMixDialog = false; this.toast.success('Mix deleted'); this.loadAll(); },
      error: () => { this.showDeleteMixDialog = false; this.toast.error('Failed to delete'); }
    });
  }

  get totalCommercialStockKg(): number {
    return this.commercialFeeds.reduce((s, f) => s + (f.stockKg || 0), 0);
  }

  get totalCommercialValue(): number {
    return this.commercialFeeds.reduce((s, f) => s + (f.stockKg || 0) * (f.pricePerKg || 0), 0);
  }
}
