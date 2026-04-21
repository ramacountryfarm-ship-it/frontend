import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchListComponent } from './pages/batch-list/batch-list.component';
import { BatchFormComponent } from './pages/batch-form/batch-form.component';

const routes: Routes = [
  { path: '', component: BatchListComponent },
  { path: 'new', component: BatchFormComponent },
  { path: 'edit/:id', component: BatchFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchesRoutingModule { }
