import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorListComponent } from './pages/vendor-list/vendor-list.component';
import { VendorFormComponent } from './pages/vendor-form/vendor-form.component';
import { VendorService } from './services/vendor.service';

@NgModule({
  declarations: [VendorListComponent, VendorFormComponent],
  imports: [SharedModule, VendorsRoutingModule],
  providers: [VendorService]
})
export class VendorsModule { }
