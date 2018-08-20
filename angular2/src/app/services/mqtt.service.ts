import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {IPIM_OPTIONS} from '../modelerConfig.service';
import {ApiService} from './api.service';
import {Router} from '@angular/router';

const mqtt = require('mqtt');

@Injectable()
export class MqttService {
  private subject: Subject<any> = new Subject<any>();
  private keepAfterNavigationChange: boolean = true;
  private client: any;

  constructor(private apiService: ApiService, private router: Router) {}

  public connect(id: string) {
    this.client = mqtt.connect(IPIM_OPTIONS.MQTT_CONNECTION, {clientId: id});
  }

  public disconnect() {
    this.client.end();
  }

  public getClient(email?: string) {
    if (this.client) {
      return this.client;
    } else if (email) {
      this.connect(email);
      return this.client;
    } else {
      // return this.client = mqtt.connect(IPIM_OPTIONS.MQTT_CONNECTION, {clientId: id});
      this.apiService.logout()
        .subscribe(
          response => {
            this.router.navigate(['/front-page']);
          },
          error => {
            console.log(error);
            this.router.navigate(['/front-page']);
          });
    }
  }
}