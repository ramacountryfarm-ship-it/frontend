import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FlockPerformanceRoutingModule } from './flock-performance-routing.module';
import { PerformanceDashboardComponent } from './pages/performance-dashboard/performance-dashboard.component';
import { PerformanceService } from './services/performance.service';

@NgModule({
  declarations: [PerformanceDashboardComponent],
  imports: [SharedModule, FlockPerformanceRoutingModule],
  providers: [PerformanceService]
})
export class FlockPerformanceModule { }
