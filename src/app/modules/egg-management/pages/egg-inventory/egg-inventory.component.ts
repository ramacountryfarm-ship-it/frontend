import { Component, OnInit } from '@angular/core';
import { EggService } from '../../services/egg.service';

@Component({
  selector: 'app-egg-inventory',
  templateUrl: './egg-inventory.component.html',
  styleUrls: ['./egg-inventory.component.scss']
})
export class EggInventoryComponent implements OnInit {
  inventory: any = { totalStock: 0, batches: [] };
  stockSummary: any[] = [];
  isLoading = true;

  get totalStock(): number {
    return this.stockSummary.reduce((s, b) => s + (b.stock || 0), 0);
  }

  get totalCollected(): number {
    return this.stockSummary.reduce((s, b) => s + (b.collected || 0), 0);
  }

  get totalDamaged(): number {
    return this.stockSummary.reduce((s, b) => s + (b.damaged || 0), 0);
  }

  get totalSold(): number {
    return this.stockSummary.reduce((s, b) => s + (b.sold || 0), 0);
  }

  constructor(private eggService: EggService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.eggService.getStockSummary().subscribe({
      next: (data) => { this.stockSummary = data; this.isLoading = false; },
      error: () => {
        // fall back to old inventory endpoint
        this.eggService.getInventory().subscribe({
          next: (inv) => {
            this.inventory = inv;
            this.stockSummary = inv.batches || [];
            this.isLoading = false;
          },
          error: () => { this.isLoading = false; }
        });
      }
    });
  }
}
