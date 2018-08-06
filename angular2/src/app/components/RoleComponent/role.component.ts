import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from "../../services/api.service";


const mqtt = require('mqtt');

@Component({
  selector: 'role-management',
  templateUrl: './role.template.html'
})

export class RoleComponent {
  private selected: any;
  private newRole: any;
  private roles: any;
  private mqtt: any;


  constructor(private apiService: ApiService, private alertService: AlertService) {
  }

  public ngOnInit() {
    this.newRole = {
      rid: '',
      role: '',
      read: '',
      write: '',
      admin: ''
    };

    this.getAllRoles();


    this.mqtt = mqtt.connect('mqtt://localhost:4711');
    this.mqtt.subscribe('ROLE');
    const i = this;
    this.mqtt.on('message', function (topic: any, message: any) {
      console.log('Test from remote:' + message.toString());
      i.getAllRoles();
    });
  }

  public getAllRoles() {
    this.roles = [];

    this.apiService.getAllRoles()
      .subscribe(response => {
          if (response.success) {
            this.roles = response.data;
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

  public roleUpdate() {
    this.apiService.roleUpdate(this.selected.rid, this.selected.role, this.selected.read, this.selected.write, this.selected.admin)
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

  public roleCreate() {
    console.log(this.selected)
    this.apiService.roleCreate(this.selected.role, this.selected.read, this.selected.write, this.selected.admin)
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

  public roleDelete() {
    this.apiService.roleDelete(this.selected.rid)
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
