import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceDashboardComponent } from './pages/performance-dashboard/performance-dashboard.component';

const routes: Routes = [
  { path: '', component: PerformanceDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlockPerformanceRoutingModule { }
