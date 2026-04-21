import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SalesRoutingModule } from './sales-routing.module';
import { SaleListComponent } from './pages/sale-list/sale-list.component';
import { SaleFormComponent } from './pages/sale-form/sale-form.component';
import { SaleService } from './services/sale.service';

@NgModule({
  declarations: [SaleListComponent, SaleFormComponent],
  imports: [SharedModule, SalesRoutingModule],
  providers: [SaleService]
})
export class SalesModule { }
