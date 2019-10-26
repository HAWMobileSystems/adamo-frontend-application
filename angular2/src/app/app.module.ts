import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { ViewerComponent } from "./viewer/viewer.component";
import { AlertComponent } from "./components/Alert/alert.component";
import { AuthGuard } from "./guards/auth.guard";
import { JwtInterceptor } from "./helpers/jwt.interceptor";
import { AlertService } from "./services/alert.service";
import { AppFooterComponent } from "./components/AppFooterComponent/footer.component";
import { AppHeaderComponent } from "./components/AppHeaderComponent/header.component";
import { ApiService } from "./services/api.service";
import { AdamoMqttService } from "./services/mqtt.service";
import { AuthenticatedHttpService } from "./services/authenticatedHttp.service";
import { Http } from "@angular/http";
import { SnackBarService } from "./services/snackbar.service";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { FrontPageModule } from "./frontpage/frontpage.module";
import { SimpleModelerComponent} from "./ModelerComponent/simplemodeler.component"

import { TokenInterceptor } from "./interceptor/token.interceptor";

import { OverviewModule } from "./overview/overview.module";
import { Router } from "@angular/router";
import { AuthService } from "./services";
import { EventEmitterService } from "./services/EventEmitter.service";
import { TabbarService } from "./services/tabbar.service";
//check for correct branch!

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: "/api/logs",
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
    FrontPageModule, OverviewModule
  ],
  declarations: [
    AppComponent,
    AppFooterComponent,
    // AppHeaderComponent,
    // DiagramComponent,
   
    ViewerComponent,
    AlertComponent,
    SimpleModelerComponent,
    
  ],
  providers: [
    AuthGuard,
    AlertService,
    SnackBarService,
    ApiService,
    AuthService,

    AdamoMqttService,
    EventEmitterService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: JwtInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
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
    // Diagnostic only: inspect router configuration
    constructor(router: Router) {
      // Use a custom replacer to display function names in the route configs
      // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;
  
      // console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
    }
}
