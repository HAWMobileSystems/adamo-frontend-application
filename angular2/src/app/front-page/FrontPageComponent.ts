import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { ApiService } from '../services/api.service';
import { MqttService } from '../services/mqtt.service';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';
//Include components for interface and styling
@Component({
  selector: 'front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.less']
})
export class FrontPageComponent implements OnInit {
  private project = environment.PROJECTNAME;
  private title: string = 'Angular 2 with BPMN-JS';
  private model: any = {};
  private loading: boolean = false;
  constructor(private router: Router, private alertService: AlertService, private apiService: ApiService, private mqttService: MqttService, private logger: NGXLogger) {
  }
  //Initialization after front-page component was loaded
  public ngOnInit(): void {
    // reset login status
    this.apiService.logout()
      .subscribe(response => {
        this.logger.debug('Successfully logged out!');
      }, error => {
        this.logger.debug(error);
        this.alertService.error('No connection to Server');
      });
  }
  // Login of user ans subscribe response of POST authenticate
  public login() {
    this.loading = true;
    this.apiService.authenticate(this.model.username, this.model.password)
      .subscribe((response: any) => {
        if (response.success) {
          this.mqttService.connect(response.email);
          this.router.navigate(['/modeler']);
        } else {
          this.alertService.error(response.json().error);
        }
      }, error => {
        this.alertService.error(error._body);
        this.logger.debug('loginerror: ', error);
        this.loading = false;
      });
  }
}
