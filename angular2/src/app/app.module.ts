import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


// used to create fake backend
import { fakeBackendProvider } from './helpers/fake-backend';
import { ReCaptchaModule} from 'angular2-recaptcha';

import { AppRoutingModule } from './app-routing.module';
import { FrontPageComponent } from './front-page/front-page.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ModelerComponent } from './modeler/modeler.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { provideRoutes} from '@angular/router';
import { TermModal} from './modeler/modals/TermModal';

// import { AlertComponent } from './alert/index';
import {AlertComponent} from "./components/Alert/alert.component";
import { AuthGuard } from './guards/auth.guard';
import { JwtInterceptor } from './helpers/jwt.interceptor';

import { AlertService } from './services/alert.service';

import {AppFooterComponent} from './components/AppFooterComponent/footer.component';
import {AppHeaderComponent} from './components/AppHeaderComponent/header.component';
import {ApiService} from "./services/api.service";
import {TestComponent} from "./test/test.component";

//check for correct branch!

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        Ng2Bs3ModalModule,
        HttpClientModule,
        ReCaptchaModule
    ],
    declarations: [
        AppComponent,
        AppFooterComponent,
        AppHeaderComponent,
        FrontPageComponent,
        TestComponent,
        ViewerComponent,
        ModelerComponent,
        AlertComponent,
        TermModal
    ],
    providers: [
        AuthGuard,
        AlertService,
        ApiService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
