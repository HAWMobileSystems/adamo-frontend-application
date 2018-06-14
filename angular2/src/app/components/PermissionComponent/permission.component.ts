import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from "../../services/api.service";


const mqtt = require('mqtt');

@Component({
  selector: 'permission-management',
  templateUrl: './permission.component.html'
})

export class PermissionComponent {
  private selected_user: any;
  private selected_permission: any;
  private selected_model: any;
  private selected_role: any;
  private users: any;
  private roles: any;
  private models: any;
  private mqtt: any;

  private select_user(user: any) {
    this.selected_user = user;
    if (this.selected_model)
      this.getPermission(user.uid, this.selected_model.mid)
  };

  private select_model(model: any) {
    this.selected_model = model;
    if (this.selected_user)
      this.getPermission(this.selected_user.uid, model.mid)
  };

  private permissionCreate(uid: any, mid: any, role: any){
    this.apiService.permissionCreate(uid, mid, role)
      .subscribe(response => {
          if (response.success) {
            // this.roles = response.data;
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          console.log(error);
        });
  }

  private permissionUpdate(pid: any, role: any){
    this.apiService.permissionUpdate
  }

  constructor(private apiService: ApiService, private alertService: AlertService) {
  }

  public ngOnInit() {

    this.getAllRoles();
    this.getAllUsers();
    this.getAllModels();

    this.mqtt = mqtt.connect('mqtt://localhost:4711');
    this.mqtt.subscribe('PERMISSION');
    this.mqtt.on('message', function (topic: any, message: any) {
      this.getAllModels();
      this.getAllUsers();
    });
  }

  public getAllRoles() {
    this.roles = [];
    this.apiService.getAllRoles()
      .subscribe(response => {
          if (response.success) {
            this.roles = response.data;
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
            this.selected_user = null;
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          console.log(error);
        });
  }

  public getAllModels() {
    this.models = [];
    this.apiService.getAllModels()
      .subscribe(response => {
          if (response.success) {
            this.models = response.data;
            this.selected_model = null;
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          console.log(error);
        });
  }

  public getPermission(user: any, model: any) {
    this.apiService.getPermission(user, model)
      .subscribe(response => {
          if (response.success) {
            this.selected_permission = response.data;
          }
          else {
            this.alertService.error(response.error)
          }
        },
        error => {
          console.log(error);
        });
  };
}
