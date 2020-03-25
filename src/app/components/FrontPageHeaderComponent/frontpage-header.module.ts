import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontpageHeaderComponent } from './frontpage-header.component';

@NgModule({
  declarations: [FrontpageHeaderComponent],
  imports: [
    CommonModule
  ], 
  exports: [FrontpageHeaderComponent]
})
export class FrontpageHeaderModule { }
