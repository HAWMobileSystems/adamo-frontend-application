import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';

import {MqttService} from '../../services/mqtt.service';

@Component({
  selector: 'role-management',
  templateUrl: './role.template.html'
})

export class RoleComponent {
  private selected: any;
  private newRole: any;
  private roles: any;

  constructor(private apiService: ApiService, private alertService: AlertService, private mqttService: MqttService) {
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

    this.mqttService.getClient().subscribe('administrations/role');
    const i = this;
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
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
          } else {
            this.alertService.error(response._body);
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
            this.mqttService.getClient().publish('administrations/role');
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

  public roleCreate() {
    console.log(this.selected);
    this.apiService.roleCreate(this.selected.role, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient().publish('administrations/role');
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

  public roleDelete() {
    this.apiService.roleDelete(this.selected.rid)
      .subscribe(response => {
          console.log(response);
          if (response.success) {
            this.mqttService.getClient().publish('administrations/role');
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
