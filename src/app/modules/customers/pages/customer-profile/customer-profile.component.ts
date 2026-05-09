import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  history: any = null;
  isLoading = true;
  customerId = '';
  activeTab = 'farm';

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id') || '';
    this.customerService.getHistory(this.customerId).subscribe({
      next: (data) => { this.history = data; this.isLoading = false; },
      error: () => { this.isLoading = false; this.router.navigate(['/customers']); }
    });
  }

  onEdit(): void { this.router.navigate(['/customers/edit', this.customerId]); }
  onBack(): void { this.router.navigate(['/customers']); }

  paymentBadgeClass(status: string): string {
    const map: Record<string, string> = {
      'Paid': 'bg-green-100 text-green-700',
      'Partial': 'bg-yellow-100 text-yellow-700',
      'Pending': 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  }
}
