import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageComponent} from './frontpage.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { FrontPageComponent} from './FrontPageComponent.component';

@NgModule({
  declarations: [ FrontPageComponent ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FrontPageModule { }
