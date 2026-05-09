import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: TradingSummaryComponent },
  { path: 'farmers', component: FarmerListComponent },
  { path: 'farmers/new', component: FarmerFormComponent },
  { path: 'farmers/edit/:id', component: FarmerFormComponent },
  { path: 'procurement', component: ProcurementListComponent },
  { path: 'procurement/new', component: ProcurementFormComponent },
  { path: 'procurement/edit/:id', component: ProcurementFormComponent },
  { path: 'resale', component: ResaleListComponent },
  { path: 'resale/new', component: ResaleFormComponent },
  { path: 'resale/edit/:id', component: ResaleFormComponent },
  { path: 'wastage', component: WastageListComponent },
  { path: 'pending-payments', component: PendingPaymentsComponent },
  { path: 'analytics', component: TradingAnalyticsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EggTradingRoutingModule { }
