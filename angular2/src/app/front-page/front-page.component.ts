import {Component, OnInit} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Router, ActivatedRoute} from '@angular/router';

import { AlertService } from '../services/alert.service';
import { AuthenticationService } from '../services/authentification.service';

@Component({
    selector: 'front-page',
    templateUrl: './front-page.component.html',
    styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {
    title: string = 'Angular 2 with BPMN-JS';
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private http: Http) {

    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/modeler';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    console.log('loginerror:', error);
                    this.loading = false;
                });
    }

    getUser() {
        return this.http.get(`https://conduit.productionready.io/api/profiles/eric`)
            .map((res: Response) => res.json());
    }

    debug() {
        var a: any;
        this.getUser().subscribe(data => a = data);
        console.log('debug!:', a);
        // this.getUser().subscribe(console.log(''));
    }

}
