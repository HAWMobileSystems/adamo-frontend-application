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
      console.log(uid,mid,role);
    this.apiService.permissionCreate(uid, mid, role)
      .subscribe(response => {
          if (response.success) {
              this.alertService.success('Permission successfully created');
              this.selected_permission=null;
              this.selected_user=null;
              this.selected_model=null;
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

  private permissionDelete(pid: any){
      console.log(pid);
      this.apiService.permissionDelete(pid)
          .subscribe(response => {
                    if (response.success) {
                        this.alertService.success('Permission deleted');
                        this.selected_permission=null;
                        this.selected_user=null;
                        this.selected_model=null;
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

  private permissionUpdate(pid: any, rid: any, uid: any, mid: any){
      console.log(uid,rid,pid,mid);
    this.apiService.permissionUpdate(uid,mid,rid,pid)
  .subscribe(response => {
              if (response.success) {
                  this.alertService.success('Permission updated');
                  this.selected_permission=null;
                  this.selected_user=null;
                  this.selected_model=null;
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
/*
  private permissionDelete(pid: any, role: any){
      this.apiService.permissionDelete
  }*/

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
            this.alertService.error(response._body)
          }
        },
        error => {
            this.alertService.error(JSON.parse(error._body).status);
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
            this.alertService.error(response._body)
          }
        },
        error => {
            this.alertService.error(JSON.parse(error._body).status);
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
            this.alertService.error(response._body)
          }
        },
        error => {
            this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public getPermission(user: any, model: any) {
    this.apiService.getPermission(user, model)
      .subscribe(response => {
          if (response.success) {
            this.selected_permission = response.data;
              console.log(this.selected_permission);
          }
          else {
            this.alertService.error(response._body)
          }
        },
        error => {
            this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  };
}
