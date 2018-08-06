import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// used to create fake backend
import { fakeBackendProvider } from './helpers/fake-backend';
import { ReCaptchaModule} from 'angular2-recaptcha';

import { AppRoutingModule } from './app-routing.module';
import { FrontPageComponent } from './front-page/front-page.component';
import {AdministrationPageComponent} from './administration-page/administration-page.component';
import { ViewerComponent } from './viewer/viewer.component';
//import { ModelerComponent } from './modeler/modeler.component';
import { ModelerComponent} from './ModelerComponent/modeler.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { provideRoutes} from '@angular/router';
import { TermModal} from './ModelerComponent/modals/TermModal';
import { VariableModal} from './ModelerComponent/modals/VariableModal';
import { InputModal} from './ModelerComponent/modals/InputModal';
import { SubProcessModal } from './ModelerComponent/modals/SubProcessModal';

// import { AlertComponent } from './alert/index';
import {AlertComponent} from './components/Alert/alert.component';
import { AuthGuard } from './guards/auth.guard';
import { JwtInterceptor } from './helpers/jwt.interceptor';

import { AlertService } from './services/alert.service';

import {AppFooterComponent} from './components/AppFooterComponent/footer.component';
import {AppHeaderComponent} from './components/AppHeaderComponent/header.component';
import {ApiService} from './services/api.service';
import {ModellerPageComponent} from './modellerPage/modellerPage.component';

import {UserComponent} from './components/UserComponent/user.component';
import {ModelComponent} from './components/ModelComponent/model.component';
import {ModelLoaderComponent} from './components/ModelLoaderComponent/modelloader.component';
import {RoleComponent} from './components/RoleComponent/role.component';
import {ProfileComponent} from './components/ProfileComponent/profile.component';
import {PermissionComponent} from './components/PermissionComponent/permission.component';
//import {Exp_frontpageComponent} from "./exp_frontpage/exp_frontpage.component";
import {VariableComponent} from './ModelerComponent/modals/variables.component';
import { InputVarComponent } from './ModelerComponent/modals/input.component';
import {EvalModal} from './ModelerComponent/modals/evaluatorModal';

//check for correct branch!

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        Ng2Bs3ModalModule,
        HttpClientModule,
        ReCaptchaModule,
        Ng2SearchPipeModule
    ],
    declarations: [
        AppComponent,
        AppFooterComponent,
        AppHeaderComponent,
        FrontPageComponent,
        AdministrationPageComponent,
        UserComponent,
        ModelComponent,
        ModelLoaderComponent,
        RoleComponent,
        ProfileComponent,
        PermissionComponent,
      ModellerPageComponent,
        ViewerComponent,
        ModelerComponent,
        AlertComponent,
        TermModal,
        VariableModal,
        InputModal,
        SubProcessModal,
        EvalModal,
        VariableComponent,
        InputVarComponent
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
