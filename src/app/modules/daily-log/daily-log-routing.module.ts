import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogListComponent } from './pages/log-list/log-list.component';
import { LogFormComponent } from './pages/log-form/log-form.component';

const routes: Routes = [
  { path: '', component: LogListComponent },
  { path: 'new', component: LogFormComponent },
  { path: 'edit/:id', component: LogFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyLogRoutingModule { }
