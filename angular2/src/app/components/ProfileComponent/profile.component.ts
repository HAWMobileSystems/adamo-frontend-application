import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from "../../services/api.service";


const mqtt = require('mqtt');

@Component({
  selector: 'profile-management',
  templateUrl: './profile.template.html'
})

export class ProfileComponent {
  private selected: any;
  private newProfile: any;
  private profiles: any;
  private mqtt: any;


  constructor(private apiService: ApiService, private alertService: AlertService) {
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


    this.mqtt = mqtt.connect('mqtt://localhost:4711');
    this.mqtt.subscribe('ROLE');
    const i = this;
    this.mqtt.on('message', function (topic: any, message: any) {
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
          }
          else {
            this.alertService.error(response._body)
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
            this.mqtt.publish('ROLE');
            this.alertService.success(response.status);
          }
          else {
            this.alertService.error(response._body)
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public profileCreate() {
    console.log(this.selected)
    this.apiService.profileCreate(this.selected.profile, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.success) {
            this.mqtt.publish('ROLE');
            this.alertService.success(response.status);
          }
          else {
            this.alertService.error(response._body)
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
            this.mqtt.publish('ROLE');
            this.alertService.success(response.status);
          }
          else {
            this.alertService.error(response._body)
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}
