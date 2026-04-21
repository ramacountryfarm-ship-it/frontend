import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { AnalyticsService } from './services/analytics.service';

@NgModule({
  declarations: [AnalyticsPageComponent],
  imports: [SharedModule, NgChartsModule, AnalyticsRoutingModule],
  providers: [AnalyticsService]
})
export class AnalyticsModule { }
