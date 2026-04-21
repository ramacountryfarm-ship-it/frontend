import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BatchesRoutingModule } from './batches-routing.module';
import { BatchListComponent } from './pages/batch-list/batch-list.component';
import { BatchFormComponent } from './pages/batch-form/batch-form.component';
import { BatchService } from './services/batch.service';

@NgModule({
  declarations: [BatchListComponent, BatchFormComponent],
  imports: [SharedModule, BatchesRoutingModule],
  providers: [BatchService]
})
export class BatchesModule { }
