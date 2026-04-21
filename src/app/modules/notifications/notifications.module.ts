import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationListComponent } from './pages/notification-list/notification-list.component';

@NgModule({
  declarations: [NotificationListComponent],
  imports: [SharedModule, NotificationsRoutingModule]
})
export class NotificationsModule { }
