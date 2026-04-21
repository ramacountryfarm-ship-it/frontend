import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VaccinationRoutingModule } from './vaccination-routing.module';
import { VaccinationListComponent } from './pages/vaccination-list/vaccination-list.component';
import { VaccinationFormComponent } from './pages/vaccination-form/vaccination-form.component';
import { VaccinationService } from './services/vaccination.service';

@NgModule({
  declarations: [VaccinationListComponent, VaccinationFormComponent],
  imports: [SharedModule, VaccinationRoutingModule],
  providers: [VaccinationService]
})
export class VaccinationModule { }
