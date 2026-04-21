import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleListComponent } from './pages/sale-list/sale-list.component';
import { SaleFormComponent } from './pages/sale-form/sale-form.component';

const routes: Routes = [
  { path: '', component: SaleListComponent },
  { path: 'new', component: SaleFormComponent },
  { path: 'edit/:id', component: SaleFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
