import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from "../../services/api.service";


// import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'user-management',
    templateUrl: './user.template.html'
})

export class UserComponent {
    private selected: any;
    private newUser: any;
    private users: any;

    constructor(private apiService: ApiService, private alertService: AlertService) {
    }

    public ngOnInit() {
        this.newUser = {
            uid: '',
            username: '',
            email: '',
            password: '',
            astlogin: '',
            firstname: '',
            lastname: '',
            role: ''
        };

        this.selected = this.newUser

        this.apiService.getAllUsers()
            .subscribe(response => {
                    if (response.success) {
                        this.users = response.data;
                    }
                    else {
                        this.alertService.error(response.error)
                    }
                },
                error => {
                    console.log(error);
                });
    }

}
