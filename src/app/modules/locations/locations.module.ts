import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LocationsRoutingModule } from './locations-routing.module';
import { LocationListComponent } from './pages/location-list/location-list.component';
import { LocationFormComponent } from './pages/location-form/location-form.component';
import { LocationService } from './services/location.service';

@NgModule({
  declarations: [LocationListComponent, LocationFormComponent],
  imports: [SharedModule, LocationsRoutingModule],
  providers: [LocationService]
})
export class LocationsModule { }
