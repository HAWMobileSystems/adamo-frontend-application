import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

import { AdamoMqttService } from '../../../services/mqtt.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-earned',
  templateUrl: './earned.component.html',
  styleUrls: ['./earned.component.css'],
})
export class EarnedComponent implements OnInit {
  set selected(value: any) {
    this._selected = value;
  }
  get selected(): any {
    return this._selected;
  }
  get profiles(): any {
    return this._profiles;
  }
  get newProfile(): any {
    return this._newProfile;
  }

  private _selected: any;
  private _newProfile: any;
  private _profiles: any;

  public search: any;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private snackbarService: SnackBarService,
    private mqttService: AdamoMqttService,
  ) {}

  public ngOnInit() {
    //defines the structure for a new empty profile
    this._newProfile = {
      rid: '',
      profile: '',
      read: '',
      write: '',
      admin: '',
    };

    this.getAllProfiles();

    this.mqttService.getClient().subscribe('administrations/Profile');
    const i = this;
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      if (topic.startsWith('administrations/Profile')) {
        console.log('Test from remote:' + message.toString());
        i.getAllProfiles();
      }
    });
  }

  //gets a list of all profiles from DB
  public getAllProfiles() {
    this._profiles = [];

    this.userService.getAllProfiles().subscribe(
      (response: { success: any; data: any; _body: string }) => {
        if (response.success) {
          this._profiles = response.data;
          this._selected = null;
        } else {
          this.snackbarService.error(response._body);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
        console.log(error);
      },
    );
  }

  //updates the selected profile
  public profileUpdate() {
    this.apiService
      .profileUpdate(
        this._selected.rid,
        this._selected.profile,
        this._selected.read,
        this._selected.write,
        this._selected.admin,
      )
      .subscribe(
        (response: { success: any; status: string; _body: string }) => {
          if (response.success) {
            this.mqttService.getClient().publish('administrations/Profile', JSON.stringify({}));
            this.snackbarService.success(response.status);
          } else {
            this.snackbarService.error(response._body);
          }
        },
        (error: { _body: string }) => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        },
      );
  }

  //creates a new profile
  public profileCreate() {
    this.apiService
      .profileCreate(this._selected.profile, this._selected.read, this._selected.write, this._selected.admin)
      .subscribe(
        (response: { success: any; status: string; _body: string }) => {
          if (response.success) {
            this.mqttService.getClient().publish('administrations/Profile', JSON.stringify({}));
            this.snackbarService.success(response.status);
          } else {
            this.snackbarService.error(response._body);
          }
        },
        (error: { _body: string }) => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        },
      );
  }

  //deletes the selected profile
  public profileDelete() {
    this.apiService.profileDelete(this._selected.rid).subscribe(
      (response: { success: any; status: string; _body: string }) => {
        if (response.success) {
          this.mqttService.getClient().publish('administrations/Profile', JSON.stringify({}));
          this.snackbarService.success(response.status);
        } else {
          this.snackbarService.error(response._body);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
        console.log(error);
      },
    );
  }
}
