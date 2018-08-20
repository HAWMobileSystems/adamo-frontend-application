import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';

import {MqttService} from '../../services/mqtt.service';

@Component({
  selector: 'profile-management',
  templateUrl: './profile.template.html'
})

export class ProfileComponent {
  private selected: any;
  private newProfile: any;
  private profiles: any;

  constructor(private apiService: ApiService, private alertService: AlertService, private mqttService: MqttService) {
  }

  public ngOnInit() {
    this.newProfile = {
      rid: '',
      profile: '',
      read: '',
      write: '',
      admin: ''
    };

    this.getAllProfiles();

    this.mqttService.getClient().subscribe('administrations/Role');
    const i = this;
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      console.log('Test from remote:' + message.toString());
      i.getAllProfiles();
    });
  }

  public getAllProfiles() {
    this.profiles = [];

    this.apiService.getAllProfiles()
      .subscribe(response => {
          if (response.success) {
            this.profiles = response.data;
            this.selected = null;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public profileUpdate() {
    this.apiService.profileUpdate(this.selected.rid, this.selected.profile, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient().publish('administrations/Role');
            this.alertService.success(response.status);
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public profileCreate() {
    this.apiService.profileCreate(this.selected.profile, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient().publish('administrations/Role');
            this.alertService.success(response.status);
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public profileDelete() {
    this.apiService.profileDelete(this.selected.rid)
      .subscribe(response => {
          console.log(response);
          if (response.success) {
            this.mqttService.getClient().publish('administrations/Role');
            this.alertService.success(response.status);
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}
