import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FilterUnique } from './pipes/filterUnique.pipe';
import { Timestamp2Date } from './pipes/timestamp.pipe';
import { Version } from './pipes/version.pipe';
import { Page404Component } from './page404/page404.component';
// import { FrontpageHeaderComponent } from './components/FrontPageHeaderComponent/frontpage-header.component';

import {TranslateService} from '@ngx-translate/core';
import { SharedMaterialModule } from './shared/material.module';

@NgModule({
  imports: [
    HttpClientModule,
    SharedMaterialModule
  ],
  declarations: [
    FilterUnique,
    Version, 
    Timestamp2Date,
    Page404Component,
  ],
  exports: [
    FilterUnique,
    Version,
    Timestamp2Date, 
    TranslateModule
  ]
})

export class SharedModule {

    constructor(private translate: TranslateService) {
        translate.addLangs(["de", "en"]);
        translate.setDefaultLang('de');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/de|en/) ? browserLang : 'de');
    }
 }