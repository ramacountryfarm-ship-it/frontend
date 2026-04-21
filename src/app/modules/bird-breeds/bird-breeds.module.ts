import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BirdBreedsRoutingModule } from './bird-breeds-routing.module';
import { BreedListComponent } from './pages/breed-list/breed-list.component';
import { BreedFormComponent } from './pages/breed-form/breed-form.component';
import { BreedInfoComponent } from './pages/breed-info/breed-info.component';
import { BirdBreedService } from './services/bird-breed.service';

@NgModule({
  declarations: [BreedListComponent, BreedFormComponent, BreedInfoComponent],
  imports: [SharedModule, BirdBreedsRoutingModule],
  providers: [BirdBreedService]
})
export class BirdBreedsModule { }
