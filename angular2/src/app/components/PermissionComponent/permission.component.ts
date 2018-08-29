import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';

import {MqttService} from '../../services/mqtt.service';

@Component({
  selector: 'permission-management',
  templateUrl: './permission.component.html'
})

export class PermissionComponent {
  private selectedUser: any;
  private selectedPermission: any;
  private selectedModel: any;
  private selectedRole: any;
  private users: any;
  private roles: any;
  private models: any;

  constructor(private apiService: ApiService, private alertService: AlertService, private mqttService: MqttService) {
  }

  //selects a user that is maintained in a permission
  private selectUser(user: any) {
    this.selectedUser = user;
    if (this.selectedModel) {
      this.getPermission(user.uid, this.selectedModel.mid);
    }
  }

  //selects a model that is maintained in a permission
  private selectModel(model: any) {
    this.selectedModel = model;
    if (this.selectedUser) {
      this.getPermission(this.selectedUser.uid, model.mid);
    }
  }

  //creates a new permission
  private permissionCreate(uid: any, mid: any, role: any) {
    console.log(uid, mid, role);
    this.apiService.permissionCreate(uid, mid, role)
      .subscribe(response => {
          if (response.success) {
            this.alertService.success('Permission successfully created');
            this.selectedPermission = null;
            this.selectedUser = null;
            this.selectedModel = null;
          } else {
            this.alertService.error(response.error)
            ;
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //deletes the selected permission
  private permissionDelete(pid: any) {
    console.log(pid);
    this.apiService.permissionDelete(pid)
      .subscribe(response => {
          if (response.success) {
            this.alertService.success('Permission deleted');
            this.selectedPermission = null;
            this.selectedUser = null;
            this.selectedModel = null;
          } else {
            this.alertService.error(response.error)
            ;
          }
        },
        error => {
          console.log(error);
        });
  }

  //updates the selected permission
  private permissionUpdate(role: any, pid: any) {
    console.log(role, pid);
    this.apiService.permissionUpdate(role, pid)
      .subscribe(response => {
          if (response.success) {
            this.alertService.success('Permission updated');
            this.selectedPermission = null;
            this.selectedUser = null;
            this.selectedModel = null;
          } else {
            this.alertService.error(response.error)
            ;
          }
        },
        error => {
          console.log(error);
        });
  }

  public ngOnInit() {

    this.getAllRoles();
    this.getAllUsers();
    this.getAllModels();
    this.mqttService.getClient().subscribe('PERMISSION');
    const self = this;
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      if (topic === 'PERMISSION') {
      console.log('PermissonMQTT');
      self.getAllModels();
      self.getAllUsers();
      }
    });
  }

  //gets a list of all roles from DB
  public getAllRoles() {
    this.roles = [];
    this.apiService.getAllRoles()
      .subscribe(response => {
          if (response.success) {
            this.roles = response.data;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //gets a list of all users from DB
  public getAllUsers() {
    this.users = [];
    this.apiService.getAllUsers()
      .subscribe(response => {
          if (response.success) {
            this.users = response.data;
            this.selectedUser = null;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //gets a list of all models from DB
  public getAllModels() {
    this.models = [];
    this.apiService.getAllModels()
      .subscribe(response => {
          if (response.success) {
            this.models = response.data;
            this.selectedModel = null;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //gets the permission of the selected user and model
  public getPermission(user: any, model: any) {
    this.apiService.getPermission(user, model)
      .subscribe(response => {
          if (response.success) {
            this.selectedPermission = response.data;
            this.alertService.success((JSON.parse(response._body).status) );
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
