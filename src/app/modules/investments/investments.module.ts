import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InvestmentsRoutingModule } from './investments-routing.module';
import { InvestmentListComponent } from './pages/investment-list/investment-list.component';
import { InvestmentFormComponent } from './pages/investment-form/investment-form.component';
import { InvestmentService } from './services/investment.service';

@NgModule({
  declarations: [InvestmentListComponent, InvestmentFormComponent],
  imports: [SharedModule, InvestmentsRoutingModule],
  providers: [InvestmentService]
})
export class InvestmentsModule { }
