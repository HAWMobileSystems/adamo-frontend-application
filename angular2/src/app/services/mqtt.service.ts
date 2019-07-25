import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

// const mqtt = require('mqtt');
import { environment } from './../../environments/environment';
@Injectable()
export class AdamoMqttService {
  private subject: Subject<any> = new Subject<any>();
  private keepAfterNavigationChange: boolean = true;
  private client: any;
  private id: string;

  constructor(private apiService: ApiService, private router: Router) {}

  public connect(id: string) {
    this.id = id;
    console.log('mqtt', environment.MQTT_HOST + ':' + environment.MQTT_PORT, {
      clientId: id
    });
    // this.client = mqtt.connect(
    //   environment.MQTT_HOST + ':' + environment.MQTT_PORT,
    //   { clientId: id }
    // );
  }

  public disconnect() {
    this.client.end();
  }

  public getID(): string {
    return this.id;
  }

  //returns the client of the mqtt
  public getClient(email?: string): any {
    if (this.client) {
      return this.client;
    } else if (email) {
      this.connect(email);
      return this.client;
    } else {
      // this.apiService.logout().subscribe(
      //   (        response: any) => {
      //     this.router.navigate(['/front-page']);
      //   },
      //   (        error: any) => {
      //     console.log(error);
      //     this.router.navigate(['/front-page']);
      //   }
      // );
    }
  }
}
