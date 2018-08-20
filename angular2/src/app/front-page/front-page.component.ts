import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert.service';
import {ApiService} from '../services/api.service';
import {MqttService} from '../services/mqtt.service';

@Component({
  selector: 'front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {
  private title: string = 'Angular 2 with BPMN-JS';
  private model: any = {};
  private loading: boolean = false;

  constructor(private router: Router,
              private alertService: AlertService,
              private apiService: ApiService,
              private mqttService: MqttService) {

  }

  public ngOnInit() {
    // reset login status
    this.apiService.logout()
      .subscribe(response => {
      }, error => {
        console.log(error);
        this.alertService.error(error);
      });
  }

  public login() {
    this.loading = true;
    this.apiService.authenticate(this.model.username, this.model.password, this.model.captcha)
      .subscribe(response => {
          if (response.success) {
            this.mqttService.connect(response.email);
            console.log(JSON.stringify(response, null, 2));
            this.router.navigate(['/modeler']);
          } else {
            this.alertService.error(response.error);
          }
        },
        error => {
          this.alertService.error(error._body);
          console.log('loginerror: ', error);
          this.loading = false;

        });
  }
}
