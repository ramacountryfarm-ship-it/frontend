import { Component, OnInit } from '@angular/core';
import { BirdBreedService } from '../../services/bird-breed.service';

@Component({
  selector: 'app-breed-info',
  templateUrl: './breed-info.component.html',
  styleUrls: ['./breed-info.component.scss']
})
export class BreedInfoComponent implements OnInit {
  breeds: any[] = [];
  isLoading = true;

  constructor(private breedService: BirdBreedService) {}

  ngOnInit(): void {
    this.breedService.getAll().subscribe({
      next: (data) => { this.breeds = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  getEggsPerMonth(eggsPerYear: number): number {
    return Math.round(eggsPerYear / 12);
  }

  formatFeedRange(schedule: any): string {
    if (!schedule || schedule.length === 0) return 'Not defined';
    return schedule
      .map((s: any) => `Week ${s.fromWeek}-${s.toWeek}: ${s.feedPerDayKg}g/day`)
      .join(', ');
  }

  getAvgFeedPerDay(schedule: any[]): number {
    if (!schedule || schedule.length === 0) return 0;
    const total = schedule.reduce((sum: number, s: any) => sum + (s.feedPerDayKg || 0), 0);
    return Math.round(total / schedule.length);
  }

  getAvgFeedPerMonth(schedule: any[]): string {
    const avgGrams = this.getAvgFeedPerDay(schedule);
    const monthlyKg = (avgGrams * 30) / 1000;
    return monthlyKg.toFixed(2);
  }
}
