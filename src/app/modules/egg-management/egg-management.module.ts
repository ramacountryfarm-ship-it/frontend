import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EggManagementRoutingModule } from './egg-management-routing.module';
import { EggCollectionComponent } from './pages/egg-collection/egg-collection.component';
import { EggDamageComponent } from './pages/egg-damage/egg-damage.component';
import { EggInventoryComponent } from './pages/egg-inventory/egg-inventory.component';
import { EggService } from './services/egg.service';

@NgModule({
  declarations: [EggCollectionComponent, EggDamageComponent, EggInventoryComponent],
  imports: [SharedModule, EggManagementRoutingModule],
  providers: [EggService]
})
export class EggManagementModule { }
