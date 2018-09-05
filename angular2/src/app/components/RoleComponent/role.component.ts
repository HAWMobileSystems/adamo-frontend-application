import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {MqttService} from '../../services/mqtt.service';
import { SnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'role-management',
  templateUrl: './role.template.html'
})

export class RoleComponent {
  private selected: any;
  private newRole: any;
  private roles: any;

  constructor(private apiService: ApiService, private snackbarService: SnackBarService, private mqttService: MqttService) {
  }

  public ngOnInit() {
    //defines the structure for a new empty role
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
      if (topic.startsWith('administrations/role')) {
        console.log('Test from remote:' + message.toString());
        i.getAllRoles();
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
            this.selected = null;
          } else {
            this.snackbarService.error(response._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //updates the selected role
  public roleUpdate() {
    this.apiService.roleUpdate(this.selected.rid, this.selected.role, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient().publish('administrations/role', JSON.stringify({}));
            this.snackbarService.success(response.status);
          } else {
            this.snackbarService.error(response._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //creates a new role
  public roleCreate() {
    console.log(this.selected);
    this.apiService.roleCreate(this.selected.role, this.selected.read, this.selected.write, this.selected.admin)
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient().publish('administrations/role', JSON.stringify({}));
            this.snackbarService.success(response.status);
          } else {
            this.snackbarService.error(response._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //deletes the selected role
  public roleDelete() {
    this.apiService.roleDelete(this.selected.rid)
      .subscribe(response => {
          console.log(response);
          if (response.success) {
            this.mqttService.getClient().publish('administrations/role', JSON.stringify({}));
            this.snackbarService.success(response.status);
          } else {
            this.snackbarService.error(response._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}
