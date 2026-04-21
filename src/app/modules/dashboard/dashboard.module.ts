import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { DashboardService } from './services/dashboard.service';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    StatCardComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    NgChartsModule
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
