import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EggTradingRoutingModule } from './egg-trading-routing.module';
import { EggTradingService } from './services/egg-trading.service';
import { TradingSummaryComponent } from './pages/trading-summary/trading-summary.component';
import { FarmerListComponent } from './pages/farmer-list/farmer-list.component';
import { FarmerFormComponent } from './pages/farmer-form/farmer-form.component';
import { ProcurementListComponent } from './pages/procurement-list/procurement-list.component';
import { ProcurementFormComponent } from './pages/procurement-form/procurement-form.component';
import { ResaleListComponent } from './pages/resale-list/resale-list.component';
import { ResaleFormComponent } from './pages/resale-form/resale-form.component';
import { WastageListComponent } from './pages/wastage-list/wastage-list.component';
import { PendingPaymentsComponent } from './pages/pending-payments/pending-payments.component';
import { TradingAnalyticsComponent } from './pages/trading-analytics/trading-analytics.component';

@NgModule({
  declarations: [
    TradingSummaryComponent,
    FarmerListComponent,
    FarmerFormComponent,
    ProcurementListComponent,
    ProcurementFormComponent,
    ResaleListComponent,
    ResaleFormComponent,
    WastageListComponent,
    PendingPaymentsComponent,
    TradingAnalyticsComponent,
  ],
  imports: [SharedModule, EggTradingRoutingModule],
  providers: [EggTradingService]
})
export class EggTradingModule { }
