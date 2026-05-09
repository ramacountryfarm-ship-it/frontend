import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';
import { CustomerProfileComponent } from './pages/customer-profile/customer-profile.component';
import { CustomerService } from './services/customer.service';

@NgModule({
  declarations: [CustomerListComponent, CustomerFormComponent, CustomerProfileComponent],
  imports: [SharedModule, CustomersRoutingModule],
  providers: [CustomerService]
})
export class CustomersModule { }
