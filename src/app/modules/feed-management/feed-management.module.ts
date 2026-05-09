import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FeedManagementRoutingModule } from './feed-management-routing.module';
import { FeedListComponent } from './pages/feed-list/feed-list.component';

@NgModule({
  declarations: [FeedListComponent],
  imports: [SharedModule, FeedManagementRoutingModule]
})
export class FeedManagementModule { }
