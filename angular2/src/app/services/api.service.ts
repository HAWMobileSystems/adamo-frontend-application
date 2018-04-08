import {Injectable} from '@angular/core';
import {RequestOptions, Http, Response} from "@angular/http";

import 'rxjs/add/operator/map'

const options = new RequestOptions({withCredentials: true});

@Injectable()
export class ApiService {
    constructor(private http: Http) {
    }


    authenticate(username: string, password: string, captcha: string) {
        return this.http.post(
            'http://localhost:3000/authenticate',
            {
                username: username,
                password: password,
                captcha: captcha
            },
            options)
            .map((response: Response) => response.json());
    }


    login_status() {
        return this.http.get('http://localhost:3000/login_status', options)
            .map((response: Response) => response.json());
    }


    logout(){
        return this.http.get('http://localhost:3000/logout', options)
            .map((response: Response) => response.json());
    }

    getAllUsers(){
        return this.http.get('http://localhost:3000/getallusers', options)
            .map((response: Response) => response.json());
    }

    userCreate(firstname, lastname, name, password){
        return this.http.post(
            'http://localhost:3000/usercreate',
            {
                username: username,
                password: password,
                captcha: captcha
            },
            options)
            .map((response: Response) => response.json());
    }
}