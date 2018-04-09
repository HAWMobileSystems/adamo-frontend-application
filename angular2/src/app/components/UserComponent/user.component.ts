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

        this.selected = this.newUser;

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

    userUpdate(){
        console.log(this.selected);
        this.apiService.userUpdate(this.selected.uid, this.selected.firstname, this.selected.lastname, this.selected.username, '$2a$10$vs1hHVA3BZw2Gma3pOIzcOZ1LgROzaUjL3EcVWG6QgbPK/ZFtGCJi')
            .subscribe(response => {
                    if (response.success){
                        console.log(JSON.stringify(response, null, 2), 'success');
                        // this.router.navigate(['/modeler']);
                    }
                    else {
                        this.alertService.error(response.error + 'something went wrong')
                    }
                },
                error => {
                    this.alertService.error(error.statusText + 'something went wrong');
                    console.log(error);
                });
    }


}
