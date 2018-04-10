import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from "../../services/api.service";




import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
    transform(categories: any, searchText: any): any {
        if(searchText == null) return categories;

        return categories.filter(function(category: any){
            return category.CategoryName.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        })
    }
}


const mqtt = require('mqtt');

@Component({
    selector: 'user-management',
    templateUrl: './user.template.html',
    styleUrls: ['./user.component.css']

})

export class UserComponent {
    private selected: any;
    private newUser: any;
    private users: any;
    private mqtt: any;


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

        this.getAllUsers();


        this.mqtt = mqtt.connect('mqtt://localhost:4711');
        this.mqtt.subscribe('USER');
        const i = this;
        this.mqtt.on('message', function (topic: any, message: any) {
            console.log('Test from remote:' + message.toString());
            i.getAllUsers();
        });
    }

    public getAllUsers() {
        this.users = [];

        this.apiService.getAllUsers()
            .subscribe(response => {
                    if (response.success) {
                        this.users = response.data;
                        this.selected = null;
                    }
                    else {
                        this.alertService.error(response.error)
                    }
                },
                error => {
                    console.log(error);
                });
    }

    public userUpdate() {
        this.apiService.userUpdate(this.selected.uid, this.selected.firstname, this.selected.lastname, this.selected.username, '$2a$10$vs1hHVA3BZw2Gma3pOIzcOZ1LgROzaUjL3EcVWG6QgbPK/ZFtGCJi')
            .subscribe(response => {
                    if (response.success) {
                        this.mqtt.publish('USER');
                    }
                    else {
                        this.alertService.error(response.error)
                    }
                },
                error => {
                    this.alertService.error(error.statusText);
                    console.log(error);
                });
    }

    public userCreate() {
        this.apiService.userCreate(this.selected.firstname, this.selected.lastname, this.selected.username, '$2a$10$vs1hHVA3BZw2Gma3pOIzcOZ1LgROzaUjL3EcVWG6QgbPK/ZFtGCJi')
            .subscribe(response => {
                    if (response.success) {
                        this.mqtt.publish('USER');
                    }
                    else {
                        this.alertService.error(response.error)
                    }
                },
                error => {
                    this.alertService.error(error.statusText);
                    console.log(error);
                });
    }

    public userDelete() {
        this.apiService.userDelete(this.selected.uid)
            .subscribe(response => {
                    console.log(response);
                    if (response.success) {
                        this.mqtt.publish('USER');
                    }
                    else {
                        this.alertService.error(response.error)
                    }
                },
                error => {
                    this.alertService.error(error.statusText);
                    console.log(error);
                });
    }
}
