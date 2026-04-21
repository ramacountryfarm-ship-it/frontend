import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <div *ngFor="let toast of toasts; trackBy: trackById"
           class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm min-w-[280px] max-w-[400px] animate-slide-in"
           [ngClass]="getToastClasses(toast.type)">
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-[#FF9500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
          </svg>
        </div>
        <!-- Message -->
        <p class="text-[13px] font-medium text-[#1d1d1f] flex-1">{{ toast.message }}</p>
        <!-- Close -->
        <button (click)="dismiss(toast.id)" class="flex-shrink-0 p-0.5 rounded-md hover:bg-black/5 transition-colors">
          <svg class="w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    :host ::ng-deep .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subs: Subscription[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subs.push(
      this.toastService.toasts$.subscribe(toast => {
        this.toasts.push(toast);
        if (toast.duration) {
          setTimeout(() => this.dismiss(toast.id), toast.duration);
        }
      }),
      this.toastService.remove$.subscribe(id => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  trackById(_: number, toast: Toast): number {
    return toast.id;
  }

  getToastClasses(type: string): string {
    switch (type) {
      case 'success': return 'bg-white/95 border-green-200';
      case 'error': return 'bg-white/95 border-red-200';
      case 'warning': return 'bg-white/95 border-orange-200';
      case 'info': return 'bg-white/95 border-blue-200';
      default: return 'bg-white/95 border-gray-200';
    }
  }
}
