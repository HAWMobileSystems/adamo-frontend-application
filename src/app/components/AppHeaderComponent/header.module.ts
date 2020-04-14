import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './header.component';
import { SharedModule } from "../../shared.module";
import { SharedLazyModule } from '../../shared/shared-lazy.module';
import { RouterModule } from  '@angular/router';
@NgModule({
  declarations: [AppHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SharedLazyModule
  ], 
  exports: [AppHeaderComponent]
})
export class AppHeaderModule { }
