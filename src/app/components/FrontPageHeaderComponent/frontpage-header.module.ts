import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontpageHeaderComponent } from './frontpage-header.component';

import { SharedLazyModule } from '../../shared/shared-lazy.module';
@NgModule({
  declarations: [FrontpageHeaderComponent],
  imports: [
    CommonModule,
    SharedLazyModule
  ], 
  exports: [FrontpageHeaderComponent]
})
export class FrontpageHeaderModule { }
