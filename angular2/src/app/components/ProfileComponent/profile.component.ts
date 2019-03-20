import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {MqttService} from '../../services/mqtt.service';
import { SnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'profile-management',
  templateUrl: './profile.template.html'
})

export class ProfileComponent {
  private selected: any;
  private newProfile: any;
  private profiles: any;

  constructor(private apiService: ApiService, private snackbarService: SnackBarService, private mqttService: MqttService) {
  }

  public ngOnInit() {
    //defines the structure for a new empty profile
    this.newProfile = {
      rid: '',
      profile: '',
      read: '',
      write: '',
      admin: ''
    };

    this.getAllProfiles();

    this.mqttService.getClient().subscribe('administrations/Profile');
    const i = this;
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      if (topic.startsWith('administrations/Profile')) {
        console.log('Test from remote:' + message.toString());
        i.getAllProfiles();
      }
    });
  }

  //gets a list of all profiles from DB
  public getAllProfiles() {
    this.profiles = [];

    this.apiService.getAllProfiles()
      .subscribe(response => {
          if (response.json().success) {
            this.profiles = response.json().data;
            this.selected = null;
          } else {
            this.snackbarService.error(response.json()._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //updates the selected profile
  public profileUpdate() {
    this.apiService.profileUpdate(this.selected.rid, this.selected.profile, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.json().success) {
            this.mqttService.getClient().publish('administrations/Profile', JSON.stringify({}));
            this.snackbarService.success(response.json().status);
          } else {
            this.snackbarService.error(response.json()._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //creates a new profile
  public profileCreate() {
    this.apiService.profileCreate(this.selected.profile, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.json().success) {
            this.mqttService.getClient().publish('administrations/Profile', JSON.stringify({}));
            this.snackbarService.success(response.json().status);
          } else {
            this.snackbarService.error(response.json()._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

   //deletes the selected profile
  public profileDelete() {
    this.apiService.profileDelete(this.selected.rid)
      .subscribe(response => {
          if (response.json().success) {
            this.mqttService.getClient().publish('administrations/Profile', JSON.stringify({}));
            this.snackbarService.success(response.json().status);
          } else {
            this.snackbarService.error(response.json()._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}
