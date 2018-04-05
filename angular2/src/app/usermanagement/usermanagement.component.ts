import {Component, OnInit} from '@angular/core';
import {Router,} from '@angular/router';

import {AlertService} from '../services/alert.service';
import {ApiService} from '../services/api.service';


@Component({
    selector: 'userManagement',
    templateUrl: './usermanagement.component.html',
    styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {
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

}