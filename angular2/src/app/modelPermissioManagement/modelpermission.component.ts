import {Component, OnInit} from '@angular/core';
import {Router,} from '@angular/router';

import {AlertService} from '../services/alert.service';
import {ApiService} from '../services/api.service';

//test
@Component({
    selector: 'ModelPermission',
    templateUrl: './modelpermission.component.html',
    styleUrls: ['./modelpermission.component.css']
})
export class ModelpermissionComponent implements OnInit {
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

}