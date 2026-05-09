import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedListComponent } from './pages/feed-list/feed-list.component';

const routes: Routes = [
  { path: '', component: FeedListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedManagementRoutingModule { }
