import { Component, OnInit } from '@angular/core';
import { EggService } from '../../services/egg.service';

@Component({
  selector: 'app-egg-inventory',
  templateUrl: './egg-inventory.component.html',
  styleUrls: ['./egg-inventory.component.scss']
})
export class EggInventoryComponent implements OnInit {
  inventory: any = { totalStock: 0, batches: [] };
  isLoading = true;

  constructor(private eggService: EggService) {}

  ngOnInit(): void {
    this.eggService.getInventory().subscribe({
      next: (data) => { this.inventory = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }
}
