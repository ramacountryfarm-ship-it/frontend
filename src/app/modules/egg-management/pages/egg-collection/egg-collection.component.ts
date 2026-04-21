import { Component, OnInit } from '@angular/core';
import { EggService } from '../../services/egg.service';

@Component({
  selector: 'app-egg-collection',
  templateUrl: './egg-collection.component.html',
  styleUrls: ['./egg-collection.component.scss']
})
export class EggCollectionComponent implements OnInit {
  collectionData: any = { summary: [], total: 0 };
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  dateFrom = '';
  dateTo = '';

  get totalPages(): number { return Math.ceil((this.collectionData.summary?.length || 0) / this.pageSize); }

  get paginatedSummary(): any[] { const items = this.collectionData.summary || []; const start = (this.currentPage - 1) * this.pageSize; return items.slice(start, start + this.pageSize); }

  goToPage(page: number): void { this.currentPage = page; }

  constructor(private eggService: EggService) {}

  ngOnInit(): void { this.loadCollection(); }

  loadCollection(): void {
    this.isLoading = true;
    this.eggService.getCollection(this.dateFrom, this.dateTo).subscribe({
      next: (data) => { this.collectionData = data; this.currentPage = 1; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onFilter(): void { this.loadCollection(); }
}
