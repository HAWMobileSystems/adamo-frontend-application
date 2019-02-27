import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { ApiService } from '../services/api.service';
import { MqttService } from '../services/mqtt.service';
import { environment } from '../../environments/environment';
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
  constructor(private router: Router, private alertService: AlertService, private apiService: ApiService, private mqttService: MqttService) {
  }
  //Initialization after front-page component was loaded
  public ngOnInit(): void {
    // reset login status
    this.apiService.logout()
      .subscribe(response => {
        console.log('Successfully logged out!');
      }, error => {
        console.log(error);
        this.alertService.error('No connection to Server');
      });
  }
  // Login of user ans subscribe response of POST authenticate
  public login() {
    this.loading = true;
    this.apiService.authenticate(this.model.username, this.model.password)
      .subscribe(response => {
        if (response.success) {
          this.mqttService.connect(response.email);
          this.router.navigate(['/modeler']);
        } else {
          this.alertService.error(response.error);
        }
      }, error => {
        this.alertService.error(error._body);
        console.log('loginerror: ', error);
        this.loading = false;
      });
  }
}
