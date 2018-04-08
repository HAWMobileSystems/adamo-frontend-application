import {Component, OnInit} from '@angular/core';
import {Router,} from '@angular/router';

import {AlertService} from '../services/alert.service';
import {ApiService} from '../services/api.service';


@Component({
    selector: 'administration-page',
    templateUrl: './administration-page.component.html',
    styleUrls: ['./administration-page.component.css']
})
export class AdministrationPageComponent implements OnInit {
    title: string = 'Angular 2 with BPMN-JS';
    model: any = {};
    loading = false;
    page: string = 'User';

    constructor(private router: Router,
                private alertService: AlertService,
                private apiService: ApiService) {

    }

    ngOnInit() {

    }

}
