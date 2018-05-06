import {Component, OnInit} from '@angular/core';
import {Router,} from '@angular/router';

import {AlertService} from '../services/alert.service';
import {ApiService} from '../services/api.service';


@Component({
    selector: 'expFrontpage',
    templateUrl: './exp_frontpage.component.html',
    styleUrls: ['./exp_frontpage.component.css']
})
export class Exp_frontpageComponent implements OnInit {
    title: string = 'Angular 2 with BPMN-JS';
    model: any = {};
    loading = false;

    constructor(private router: Router,
                private alertService: AlertService,
                private apiService: ApiService) {

    }
//hier ist kommentar
    ngOnInit() {
        // reset login status
        this.apiService.logout()
            .subscribe(response => {
            }, error => {
                console.log(error);
                this.alertService.error(error)
            });
    }

    login() {
        this.loading = true;
        this.apiService.authenticate(this.model.username, this.model.password, this.model.captcha)
            .subscribe(response => {
                    if (response.success){
                        console.log(JSON.stringify(response, null, 2));
                        this.router.navigate(['/modeler']);
                    }
                    else {
                        this.alertService.error(response.error)
                    }
                },
                error => {
                    this.alertService.error(error.statusText);
                    console.log('loginerror: ', error);
                    this.loading = false;
                });
    }
}
