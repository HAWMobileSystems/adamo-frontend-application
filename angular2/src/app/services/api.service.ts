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


    logout() {
        return this.http.get('http://localhost:3000/logout', options)
            .map((response: Response) => response.json());
    }

    getAllUsers() {
        return this.http.get('http://localhost:3000/getallusers', options)
            .map((response: Response) => response.json());
    }

    userDelete(uid: number) {
        var deleteOptions = options;
        deleteOptions.body = {userid: uid}
        return this.http.delete('http://localhost:3000/userdelete', deleteOptions)
            .map((response: Response) => response.json());
    }

    userUpdate(userid: number, firstname: string, lastname: string, name: string, password: string) {
        return this.http.post('http://localhost:3000/userupdate', {
            userid: userid,
            firstname: firstname,
            lastname: lastname,
            name: name,
            password: password
        }, options)
            .map((response: Response) => response.json());
    }

    userCreate(firstname: string, lastname: string, name: string, password: string){
        return this.http.post('http://localhost:3000/usercreate', {
            firstname: firstname,
            lastname: lastname,
            name: name,
            password: password
        }, options)
            .map((response: Response) => response.json());
    }

    // userCreate(firstname, lastname, name, password){
    //     return this.http.post(
    //         'http://localhost:3000/usercreate',
    //         {
    //             username: username,
    //             password: password,
    //             captcha: captcha
    //         },
    //         options)
    //         .map((response: Response) => response.json());
    // }
}