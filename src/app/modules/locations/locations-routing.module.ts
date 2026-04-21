import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationListComponent } from './pages/location-list/location-list.component';
import { LocationFormComponent } from './pages/location-form/location-form.component';

const routes: Routes = [
  { path: '', component: LocationListComponent },
  { path: 'new', component: LocationFormComponent },
  { path: 'edit/:id', component: LocationFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
