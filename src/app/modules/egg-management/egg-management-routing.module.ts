import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EggCollectionComponent } from './pages/egg-collection/egg-collection.component';
import { EggDamageComponent } from './pages/egg-damage/egg-damage.component';
import { EggInventoryComponent } from './pages/egg-inventory/egg-inventory.component';

const routes: Routes = [
  { path: '', redirectTo: 'collection', pathMatch: 'full' },
  { path: 'collection', component: EggCollectionComponent },
  { path: 'damage', component: EggDamageComponent },
  { path: 'inventory', component: EggInventoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EggManagementRoutingModule { }
