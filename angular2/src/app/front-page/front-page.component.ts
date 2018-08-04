import {Component, OnInit} from '@angular/core';
import {Router,} from '@angular/router';

import {AlertService} from '../services/alert.service';
import {ApiService} from '../services/api.service';
import {generateErrorMessage} from "codelyzer/angular/styles/cssLexer";


@Component({
    selector: 'front-page',
    templateUrl: './front-page.component.html',
    styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {
    title: string = 'Angular 2 with BPMN-JS';
    model: any = {};
    loading = false;

    constructor(private router: Router,
                private alertService: AlertService,
                private apiService: ApiService) {

    }

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
                    this.alertService.error(error._body);
                    console.log('loginerror: ', error);
                    this.loading = false;

                });
    }

    debug1() {
        this.apiService.authenticate('1', '12341234', '1234')
            .subscribe(response => {
                    console.log(response)
                    this.router.navigate(['/modeler']);
                },
                error => {
                    console.log('loginerror: ', error);
                });
    }


    debug2() {
        this.apiService.authenticate('2', '12341234', '1234')
            .subscribe(response => {
                    this.router.navigate(['/modeler']);
                },
                error => {
                    console.log(error);
                });
    }

}
