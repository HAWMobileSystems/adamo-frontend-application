import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { MqttService, IMqttServiceOptions, IMqttMessage } from 'ngx-mqtt';
// const mqtt = require('mqtt');
import { environment } from './../../environments/environment';
@Injectable()
export class AdamoMqttService {
  private subject: Subject<any> = new Subject<any>();
  private keepAfterNavigationChange = true;
  // private client: any;
  private id: string;
  private subscriptionMap: Map<string, Subscription> = new Map<string, Subscription>();

  constructor(private apiService: ApiService, private router: Router, private mqttService: MqttService) {}

  public connect(id: string) {
    const config: IMqttServiceOptions = {
      connectOnCreate: true,
      hostname: environment.MQTT_HOST,
      port: environment.MQTT_PORT,
    };

    this.id = id;
    // console.log('mqtt', environment.MQTT_HOST + ':' + environment.MQTT_PORT, {
    //   clientId: id
    // });

    this.mqttService.connect({ ...config, clientId: id });
    // this.client = mqtt.connect(
    //   environment.MQTT_HOST + ':' + environment.MQTT_PORT,
    //   { clientId: id }
    // );
  }

  public disconnect() {
    this.mqttService.disconnect(true);
  }

  public getID(): string {
    return this.id;
  }

  public unsubscribe(topic: string): void {
    this.subscriptionMap.get(topic).unsubscribe();
  }

  public subscribe(topic: string): void {
    const subscription = this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
      const messagePayload = message.payload.toString();
    });
    this.subscriptionMap.set(topic, subscription);
    //const subscription: Subscription = this.mqttService.observe(topic).subscribe();
  }

  public publish(topic: string, payload: string): void {
    this.mqttService.unsafePublish(topic, payload, { qos: 1, retain: true });
  }
  //returns the client of the mqtt
  public getClient(email?: string): any {
    console.log('MQTT getClient', this.mqttService);
    if (this.mqttService) {
      return this.mqttService;
    } else if (email) {
      this.connect(email);
      return this.mqttService;
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
