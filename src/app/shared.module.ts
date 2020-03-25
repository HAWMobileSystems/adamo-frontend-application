import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FilterUnique } from './pipes/filterUnique.pipe';
import { Timestamp2Date } from './pipes/timestamp.pipe';
import { Version } from './pipes/version.pipe';
import { Page404Component } from './page404/page404.component';
// import { FrontpageHeaderComponent } from './components/FrontPageHeaderComponent/frontpage-header.component';


@NgModule({
  imports: [
  ],
  declarations: [
    FilterUnique,
    Version, 
    Timestamp2Date,
    
    Page404Component
  ],
  exports: [
    FilterUnique,
    Version,
    Timestamp2Date
  ]
})

export class SharedModule { }