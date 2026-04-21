import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreedListComponent } from './pages/breed-list/breed-list.component';
import { BreedFormComponent } from './pages/breed-form/breed-form.component';
import { BreedInfoComponent } from './pages/breed-info/breed-info.component';

const routes: Routes = [
  { path: '', component: BreedListComponent },
  { path: 'info', component: BreedInfoComponent },
  { path: 'new', component: BreedFormComponent },
  { path: 'edit/:id', component: BreedFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BirdBreedsRoutingModule { }
