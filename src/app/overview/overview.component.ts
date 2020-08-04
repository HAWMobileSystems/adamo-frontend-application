import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Model } from '../models/model';
import { ModelerComponent } from '../ModelerComponent/modeler.component';
import { AdamoMqttService } from '../services/mqtt.service';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { SnackBarService } from '../services/snackbar.service';
import { SnackBarMessage } from '../services/snackBarMessage';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// import { RoleType } from "../../../../../adamo-nest-server/src/constants/role-type";
import { EventEmitterService } from '../services/EventEmitter.service';
import { TabbarService } from '../services/tabbar.service';
import { TranslateService } from '@ngx-translate/core';

//Include components for interface and styling
@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less'],
  // providers: [EventEmitterService]
})
export class OverviewComponent implements OnInit {
  public title = 'ADAMO';
  public model: any = {};
  public loading = false;
  public page = '+';
  public page2 = 'User';
  public permission: number;
  public xml: string = IPIM_OPTIONS.NEWMODEL;
  public models: Model[];
  public snackBarMessages: SnackBarMessage[] = [];
  public snackbarTextPage = '';
  public username = '';
  public currentUser = null;

  constructor(
    // private apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private authService: AuthService,
    private router: Router,
    private mqttService: AdamoMqttService,
    private tabbarService: TabbarService,
    private snackbarService: SnackBarService,
    private translate: TranslateService,
  ) {
    eventEmitterService.emitModelSelected$.subscribe((model) => {
      console.log(`model ${model}`);
      this.tabbarService.addTab(model);
      // this.models = this.tabbarService.getModelTabs();
      // this.models.push(model);

      // console.log(`models ${this.models}`);
      this.onLoadModel(model);
      this.router.navigate([`overview/model/${model.id}/${model.model_version}`]);
    });

  }

  private initMqtt() {
    try {
      this.mqttService.getClient().subscribe('collaborator/update/+/+');
      this.mqttService.getClient().subscribe('modelupsert');
      this.mqttService.getClient().on('message', (topic: any, message: any) => {
        console.log(topic);
        if (topic === 'modelupsert') {
          const event = JSON.parse(message);
          const idAndVersion = this.page.split('_');
          if (idAndVersion[0] === event.id.toString() && idAndVersion[1] === event.model_version) {
            this.page = event.mid + '_' + event.newVersion;
            console.log(this.page);
          }
        } else if (topic.startsWith('collaborator/update')) {
          console.log(topic, JSON.parse(message));
          console.log(this.models);
          this.models.forEach((model) => {
            console.log(model.id, parseInt(topic.split('/')[2]), model.version, topic.split('/')[3]);
            if (model.id === parseInt(topic.split('/')[2]) && model.version === topic.split('/')[3]) {
              model.collaborator = JSON.parse(message);
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Initialization after ModellerPageComponent component was loaded
  public ngOnInit() {
    this.snackbarService.snackBarMessages$.subscribe((data: SnackBarMessage[]) => {
      this.snackBarMessages = data;
    });

    try {
      this.currentUser = this.authService.getCurrentUser();
    } catch (error) {
      this.router.navigate['/'];
    }

    // this.authService.login_status().subscribe(
    //   (response: any) => {

    //     console.log(response);
    //     //         if (response.success) {
    //     //   this.username = response.email;
    //     //   this.mqttService.getClient(response.email);
    //     //   this.initMqtt();
    //     //   this.permission = parseInt(response.permission);
    //     // } else {
    //     //   this.username = "";
    //     //   this.snackbarService.error("error while retrieving session");
    //     //   this.router.navigate(["/front-page"]);
    //     // }
    //   },
    //   error => {
    //     this.username = "";
    //     this.snackbarService.error(
    //       "Error could not connect to session management"
    //     );
    //     this.router.navigate(["/front-page"]);
    //   }
    // );
  }

  public isAdmin() {
    // console.log('isAdmin() : ',this.currentUser, RoleType.Admin, this.currentUser.role === RoleType.Admin )
    if (!this.currentUser) {
      this.router.navigate['/'];
      return false;
    }

    return this.currentUser.role === 'ADMIN';
    // return this.currentUser.role === RoleType.Admin; TODO!
  }

  public remove(index: number): void {
    console.log(this.models[index]);
    try {
      this.mqttService
        .getClient()
        .unsubscribe('MODEL/model_' + this.models[index].id + '_' + this.models[index].version);
    } catch (error) {
      console.log('error', error);
    }
    this.models.splice(index, 1);
    this.page = '+';
  }

  public loadError(error: any): void {
    if (JSON.parse(error._body).status !== 'no permission to read!') {
      this.snackbarService.newSnackBarMessage('Error: ' + JSON.parse(error._body).status, 'red');
    }
  }

  //Show previous versions of a model, if the last one was selected
  public onLoadModel(model: Model): void {
    console.log('overview.models', this.models);
    console.log('overview.component', model);
    // model.collaborator = [];
    // this.loading = true;
    // let exists: boolean;
    // this.models.forEach(element => {
    //   if (element.id === model.id && element.version === model.version) {
    //     exists = true;
    //   }
    // });
    // !exists ? this.models.push(model) : (this.loading = false);
    // this.page = model.id + "_" + model.version;
  }

  public onExportModel(modelerComponent: ModelerComponent): void {
    this.models[this.models.length - 1].modelerComponent = modelerComponent;
  }

  public onLoadSubProcess(model: Model): void {
    console.log('loadedModel', model);
    this.onLoadModel(model);
  }

  public onLoadedCompletely(): void {
    this.loading = false;
    console.log('loading complected');
  }
}
