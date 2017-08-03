import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { FrontPageComponent } from './front-page/front-page.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ModelerComponent } from './modeler/modeler.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { provideRoutes} from '@angular/router';

import {AppFooterComponent} from './components/AppFooterComponent/footer.component';
import {AppHeaderComponent} from './components/AppHeaderComponent/header.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        Ng2Bs3ModalModule
    ],
    declarations: [
        AppComponent,
        AppFooterComponent,
        AppHeaderComponent,
        FrontPageComponent,
        ViewerComponent,
        ModelerComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
