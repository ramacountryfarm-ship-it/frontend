import { Component, OnInit } from '@angular/core';
import { PerformanceService } from '../../services/performance.service';
import { BatchService } from '../../../batches/services/batch.service';

@Component({
  selector: 'app-performance-dashboard',
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.scss']
})
export class PerformanceDashboardComponent implements OnInit {
  batches: any[] = [];
  selectedBatchId = '';
  isLoading = true;

  metrics = {
    henDayProduction: 0,
    mortalityRate: 0,
    feedEfficiency: 0
  };

  feedRequirements: any[] = [];
  eggPrediction: any = { predictedEggs: 0, confidence: '' };
  feedCostPerEgg: any = { cost: 0, totalFeedCost: 0, totalEggs: 0 };

  constructor(
    private performanceService: PerformanceService,
    private batchService: BatchService
  ) {}

  ngOnInit(): void {
    this.batchService.getAll().subscribe(data => {
      this.batches = data;
      this.loadAll();
    });
  }

  onBatchChange(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.isLoading = true;
    this.loadMetrics();
    this.loadFeedRequirements();
    this.loadEggPrediction();
    this.loadFeedCostPerEgg();
  }

  private loadMetrics(): void {
    this.performanceService.getMetrics(this.selectedBatchId).subscribe({
      next: (data) => { this.metrics = { ...this.metrics, ...data }; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  private loadFeedRequirements(): void {
    this.performanceService.getFeedRequirements().subscribe({
      next: (data) => {
        this.feedRequirements = (data || []).map((r: any) => ({
          batchName: r.batchName,
          birds: r.currentBirds,
          feedPerBird: r.feedPerBirdKg,
          totalFeed: r.totalFeedKg
        }));
      },
      error: () => {}
    });
  }

  private loadEggPrediction(): void {
    this.performanceService.getEggPrediction(this.selectedBatchId).subscribe({
      next: (data) => { this.eggPrediction = data; },
      error: () => {}
    });
  }

  getTotalFeed(): number {
    return this.feedRequirements.reduce((sum, r) => sum + (r.totalFeed || 0), 0);
  }

  private loadFeedCostPerEgg(): void {
    this.performanceService.getFeedCostPerEgg(this.selectedBatchId).subscribe({
      next: (data) => {
        this.feedCostPerEgg = {
          cost: data.costPerEgg || 0,
          totalFeedCost: data.totalFeedCost || 0,
          totalEggs: data.totalEggs || 0
        };
      },
      error: () => {}
    });
  }
}
