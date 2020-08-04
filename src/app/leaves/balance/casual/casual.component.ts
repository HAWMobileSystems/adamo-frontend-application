import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../../services/api.service';

import { AdamoMqttService } from '../../../services/mqtt.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-casual',
  templateUrl: './casual.component.html',
  styleUrls: ['./casual.component.css'],
})
export class CasualComponent implements OnInit {
  get roles(): any {
    return this._roles;
  }
  get models(): any {
    return this._models;
  }
  get selectedUser(): any {
    return this._selectedUser;
  }
  get selectedRole(): any {
    return this._selectedRole;
  }
  get selectedModel(): any {
    return this._selectedModel;
  }
  get selectedPermission(): any {
    return this._selectedPermission;
  }
  get users(): any {
    return this._users;
  }
  public search: string;
  private _selectedUser: any;
  private _selectedPermission: any;
  private _selectedModel: any;
  private _selectedRole: any;
  private _users: any;
  private _roles: any;
  private _models: any;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private snackbarService: SnackBarService,
    private mqttService: AdamoMqttService,
  ) {}

  //selects a user that is maintained in a permission
  private selectUser(user: any) {
    this._selectedUser = user;
    if (this._selectedModel) {
      this.getPermission(user.uid, this._selectedModel.mid);
    }
  }

  //selects a model that is maintained in a permission
  private selectModel(model: any) {
    this._selectedModel = model;
    if (this._selectedUser) {
      this.getPermission(this._selectedUser.id, model.id);
    }
  }

  //creates a new permission
  private permissionCreate(uid: any, mid: any, role: any) {
    this.apiService.permissionCreate(uid, mid, role).subscribe(
      (response: { success: any; error: string }) => {
        if (response.success) {
          this.snackbarService.success('Permission successfully created');
          this._selectedPermission = null;
          this._selectedUser = null;
          this._selectedModel = null;
        } else {
          this.snackbarService.error(response.error);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
        console.log(error);
      },
    );
  }

  //deletes the selected permission
  private permissionDelete(pid: any) {
    this.apiService.permissionDelete(pid).subscribe(
      (response: { success: any; error: string }) => {
        if (response.success) {
          this.snackbarService.success('Permission deleted');
          this._selectedPermission = null;
          this._selectedUser = null;
          this._selectedModel = null;
        } else {
          this.snackbarService.error(response.error);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
        console.log(error);
      },
    );
  }

  //updates the selected permission
  private permissionUpdate(role: any, pid: any) {
    this.apiService.permissionUpdate(role, pid).subscribe(
      (response: { success: any; error: string }) => {
        if (response.success) {
          this.snackbarService.success('Permission updated');
          this._selectedPermission = null;
          this._selectedUser = null;
          this._selectedModel = null;
        } else {
          this.snackbarService.error(response.error);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
        console.log(error);
      },
    );
  }

  public ngOnInit() {
    this._roles = this.getAllRoles();
    this.getAllUsers();
    this.getAllModels();
    this.mqttService.getClient().subscribe('PERMISSION');

    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      if (topic === 'PERMISSION') {
        console.log('PermissonMQTT');
        this.getAllModels();
        this.getAllUsers();
      }
    });
  }

  //gets a list of all roles from DB
  public getAllRoles(): any {
    this._roles = [];
    return this.apiService.getAllRoles().subscribe(
      (response: any) => {
        this._roles = response;
        return response;
      },
      (error: any) => {
        this.snackbarService.error(JSON.parse(error).status);
        console.log(error);
      },
    );
  }

  //gets a list of all users from DB
  public getAllUsers() {
    this._users = [];
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        this._users = response;
        this._selectedUser = null;
      },
      (error: any) => {
        this.snackbarService.error(JSON.parse(error).status);
        console.log(error);
      },
    );
  }

  //gets a list of all models from DB
  public getAllModels() {
    this._models = [];
    this.apiService.getAllModels().subscribe(
      (response: any) => {
        this._models = response;
        this._selectedModel = null;
      },
      (error: any) => {
        this.snackbarService.error(JSON.parse(error).status);
        console.log(error);
      },
    );
  }

  //gets the permission of the selected user and model

  public getPermission(user: any, model: any) {
    this.apiService.getPermission(user, model).subscribe(
      (response: any) => {
        this._selectedPermission = response[0].roleName;
      },
      (error: any) => {
        this.snackbarService.error('Error receiving permissions');
        console.log(error);
      },
    );
  }
}
