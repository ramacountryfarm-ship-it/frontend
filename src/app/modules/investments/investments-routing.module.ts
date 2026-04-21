import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentListComponent } from './pages/investment-list/investment-list.component';
import { InvestmentFormComponent } from './pages/investment-form/investment-form.component';

const routes: Routes = [
  { path: '', component: InvestmentListComponent },
  { path: 'new', component: InvestmentFormComponent },
  { path: 'edit/:id', component: InvestmentFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentsRoutingModule { }
