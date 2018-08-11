import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert.service';
import {ApiService} from '../services/api.service';

@Component({
    selector: 'administration-page',
    templateUrl: './administration-page.component.html',
    styleUrls: ['./administration-page.component.css']
})

export class AdministrationPageComponent implements OnInit {
    public title: string = 'Angular 2 with BPMN-JS';
    public model: any = {};
    public loading: any = false;
    public page: string = 'User';

    constructor(private router: Router,
                private alertService: AlertService,
                private apiService: ApiService) {

    }

    public ngOnInit(): void {
        console.log('Administration page initialized');
    }

}
