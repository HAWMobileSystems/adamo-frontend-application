import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';

const mqtt = require('mqtt');

@Component({
  selector: 'user-management',
  templateUrl: './user.template.html',
  styleUrls: ['./user.component.css']

})

export class UserComponent {
  private selected: any;
  private newUser: any;
  private users: any;
  private profiles: any;
  private mqtt: any;

  constructor(private apiService: ApiService, private alertService: AlertService) {
  }

  public ngOnInit() {
    this.newUser = {
      uid: '',
      email: '',
      password: '',
      lastlogin: '',
      firstname: '',
      lastname: '',
      profile: ''
    };

    this.getAllUsers();
    this.getAllProfiles();

    this.mqtt = mqtt.connect('mqtt://localhost:4711');
    this.mqtt.subscribe('USER');
    const i = this;
    this.mqtt.on('message', (topic: any, message: any) => {
      console.log('Test from remote:' + message.toString());
      i.getAllUsers();
    });
  }

  public getAllProfiles() {
    this.profiles = [];

    this.apiService.getAllProfiles()
      .subscribe(response => {
          if (response.success) {
            this.profiles = response.data;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
        });
  }

  public getAllUsers() {
    this.users = [];

    this.apiService.getAllUsers()
      .subscribe(response => {
          if (response.success) {
            this.users = response.data;
            this.selected = null;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
        });
  }

  public userUpdate() {
    this.apiService.userUpdate(
      this.selected.uid,
      this.selected.email,
      this.selected.firstname,
      this.selected.lastname,
      this.selected.profile)
      .subscribe(response => {
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success(response);
            this.alertService.success(response.status);
            console.log(response);
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
        });
  }

  public userPassword() {
    this.apiService.userPassword(this.selected.uid, this.selected.password)
      .subscribe(response => {
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success(response);
            this.alertService.success(response.status);
            console.log(response);
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
        });
  }

  public userCreate() {
    this.apiService.userCreate(
      this.selected.email,
      this.selected.firstname,
      this.selected.lastname,
      this.selected.profile,
      this.selected.password)
      .subscribe(response => {
          console.log('debug');
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success(response.status);
            console.log(response);
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
        });
  }

  public userDelete() {
    this.apiService.userDelete(this.selected.uid)
      .subscribe(response => {
          console.log(response);
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success('User successfully deleted');

            //console.log(response);

          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
        });
  }
}
