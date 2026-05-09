import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MedicineRoutingModule } from './medicine-routing.module';
import { MedicineListComponent } from './pages/medicine-list/medicine-list.component';

@NgModule({
  declarations: [MedicineListComponent],
  imports: [SharedModule, MedicineRoutingModule]
})
export class MedicineModule { }
