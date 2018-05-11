import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from "../../services/api.service";


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
    this.mqtt.on('message', function (topic: any, message: any) {
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
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          console.log(error);
        });
  }

  public getAllUsers() {
    this.users = [];

    this.apiService.getAllUsers()
      .subscribe(response => {
          if (response.success) {
            this.users = response.data;
            this.selected = null;
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          console.log(error);
        });
  }

  public userUpdate() {
    this.apiService.userUpdate(this.selected.uid, this.selected.email, this.selected.firstname, this.selected.lastname, this.selected.profile)
      .subscribe(response => {
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success(response);
            console.log(response);
          }
          else {
            this.alertService.error(response.error);
          }
        },
        error => {
          this.alertService.error(error.statusText);
          console.log(error);
        });
  }

  public userPassword() {
    this.apiService.userPassword(this.selected.uid, this.selected.password)
      .subscribe(response => {
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success(response);
            console.log(response);
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          this.alertService.error(error.statusText);
          console.log(error);
        });
  }

  public userCreate() {
    this.apiService.userCreate(this.selected.email, this.selected.firstname, this.selected.lastname, this.selected.profile, this.selected.password)
      .subscribe(response => {
        console.log('debug');
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success(response);
            console.log(response);
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          this.alertService.error(error.statusText);
          console.log(error);
        });
  }

  public userDelete() {
    this.apiService.userDelete(this.selected.uid)
      .subscribe(response => {
          console.log(response);
          if (response.success) {
            this.mqtt.publish('USER');
            this.alertService.success(response);
            console.log(response);
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          this.alertService.error(error.statusText);
          console.log(error);
        });
  }
}
