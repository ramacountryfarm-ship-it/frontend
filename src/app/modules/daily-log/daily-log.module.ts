import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DailyLogRoutingModule } from './daily-log-routing.module';
import { LogListComponent } from './pages/log-list/log-list.component';
import { LogFormComponent } from './pages/log-form/log-form.component';
import { DailyLogService } from './services/daily-log.service';

@NgModule({
  declarations: [LogListComponent, LogFormComponent],
  imports: [SharedModule, DailyLogRoutingModule],
  providers: [DailyLogService]
})
export class DailyLogModule { }
