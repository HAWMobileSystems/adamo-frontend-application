import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {AppRoutingModule} from './app-routing.module';
import {FrontPageComponent} from './front-page/front-page.component';
import {ViewerComponent} from './viewer/viewer.component';
import {ModelerComponent} from './ModelerComponent/modeler.component';
import {BsModalModule} from 'ng2-bs3-modal';
import {TermModal} from './ModelerComponent/modals/TermModal/TermModal';
import {VariableModal} from './ModelerComponent/modals/VariableModal/VariableModal';
import {InputModal} from './ModelerComponent/modals/InputModal/InputModal';
import {SubProcessModal} from './ModelerComponent/modals/SubProcessModal/SubProcessModal';
import {AlertComponent} from './components/Alert/alert.component';
import {AuthGuard} from './guards/auth.guard';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {AlertService} from './services/alert.service';
import {AppFooterComponent} from './components/AppFooterComponent/footer.component';
import {AppHeaderComponent} from './components/AppHeaderComponent/header.component';
import {ApiService} from './services/api.service';
import {MqttService} from './services/mqtt.service';
import {ModellerPageComponent} from './modellerPage/modellerPage.component';
import {UserComponent} from './components/UserComponent/user.component';
import {ModelComponent} from './components/ModelComponent/model.component';
import {ModelLoaderComponent} from './components/ModelLoaderComponent/modelloader.component';
import {RoleComponent} from './components/RoleComponent/role.component';
import {ProfileComponent} from './components/ProfileComponent/profile.component';
import {PermissionComponent} from './components/PermissionComponent/permission.component';
import {VariableComponent} from './ModelerComponent/modals//VariablesComponent/variables.component';
import {InputVarComponent} from './ModelerComponent/modals/InputComponent/input.component';
import {EvalModal} from './ModelerComponent/modals/evaluatorModal/evaluatorModal';
import {SaveModal} from './ModelerComponent/modals/saveModal/saveModal';
import {UsageModal} from './ModelerComponent/modals/UsageModal/UsageModal';
import {FilterUnique} from './pipes/filterUnique.pipe';
import {Timestamp2Date} from './pipes/timestamp.pipe';
import {Version} from './pipes/version.pipe';
import {AuthenticatedHttpService} from './services/authenticatedHttp.service';
import {Http} from '@angular/http';
import { SnackBarService } from './services/snackbar.service';

//check for correct branch!

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    BsModalModule ,
    HttpClientModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    AppComponent,
    AppFooterComponent,
    AppHeaderComponent,
    FrontPageComponent,
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
    SaveModal,
    UsageModal,
    VariableComponent,
    InputVarComponent,
    FilterUnique,
    Timestamp2Date,
    Version
  ],
  providers: [
    AuthGuard,
    AlertService,
    SnackBarService,
    ApiService,
    MqttService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: Http,
      useClass: AuthenticatedHttpService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
