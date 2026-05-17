import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsHubComponent } from './pages/reports-hub/reports-hub.component';
import { MonthlyPlComponent } from './pages/monthly-pl/monthly-pl.component';
import { BatchPerformanceComponent } from './pages/batch-performance/batch-performance.component';
import { CustomerReportComponent } from './pages/customer-report/customer-report.component';
import { EggTrendComponent } from './pages/egg-trend/egg-trend.component';

@NgModule({
  declarations: [
    ReportsHubComponent,
    MonthlyPlComponent,
    BatchPerformanceComponent,
    CustomerReportComponent,
    EggTrendComponent,
  ],
  imports: [SharedModule, ReportsRoutingModule]
})
export class ReportsModule { }
