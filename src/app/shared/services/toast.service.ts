import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts$ = new Subject<Toast>();
  remove$ = new Subject<number>();

  success(message: string, duration = 3000): void {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration = 4000): void {
    this.show({ type: 'error', message, duration });
  }

  warning(message: string, duration = 3500): void {
    this.show({ type: 'warning', message, duration });
  }

  info(message: string, duration = 3000): void {
    this.show({ type: 'info', message, duration });
  }

  private show(toast: Omit<Toast, 'id'>): void {
    this.toasts$.next({ ...toast, id: ++this.counter });
  }

  dismiss(id: number): void {
    this.remove$.next(id);
  }
}
