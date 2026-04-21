import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccinationListComponent } from './pages/vaccination-list/vaccination-list.component';
import { VaccinationFormComponent } from './pages/vaccination-form/vaccination-form.component';

const routes: Routes = [
  { path: '', component: VaccinationListComponent },
  { path: 'new', component: VaccinationFormComponent },
  { path: 'edit/:id', component: VaccinationFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccinationRoutingModule { }
