import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsHubComponent } from './pages/reports-hub/reports-hub.component';
import { MonthlyPlComponent } from './pages/monthly-pl/monthly-pl.component';
import { BatchPerformanceComponent } from './pages/batch-performance/batch-performance.component';
import { CustomerReportComponent } from './pages/customer-report/customer-report.component';
import { EggTrendComponent } from './pages/egg-trend/egg-trend.component';

const routes: Routes = [
  { path: '', component: ReportsHubComponent },
  { path: 'monthly-pl', component: MonthlyPlComponent },
  { path: 'batch-performance', component: BatchPerformanceComponent },
  { path: 'customer-report', component: CustomerReportComponent },
  { path: 'egg-trend', component: EggTrendComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
