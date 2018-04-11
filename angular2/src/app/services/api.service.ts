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

    userDelete(userid: number) {
        const deleteOptions = options;
        deleteOptions.body = {userid: userid};
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



    getAllRoles() {
        return this.http.get('http://localhost:3000/getallroles', options)
            .map((response: Response) => response.json());
    }

    roleDelete(roleid: number) {
        const deleteOptions = options;
        deleteOptions.body = {roleid: roleid};
        return this.http.delete('http://localhost:3000/roledelete', deleteOptions)
            .map((response: Response) => response.json());
    }

    roleUpdate(roleid: number, role: string, read: boolean, write: boolean, admin: boolean) {
        return this.http.post('http://localhost:3000/roleupdate', {
            roleid: roleid,
            role: role,
            read: read,
            write: write,
            admin: admin
        }, options)
            .map((response: Response) => response.json());
    }

    roleCreate(role: string, read: boolean, write: boolean, admin: boolean){
        return this.http.post('http://localhost:3000/rolecreate', {
            role: role,
            read: read,
            write: write,
            admin: admin
        }, options)
            .map((response: Response) => response.json());
    }




    getModel(mid: string) {
        return this.http.get('http://localhost:3000/getmodel/' + mid, options)
            .map((response: Response) => response.json());
    }

    getAllModels() {
        return this.http.get('http://localhost:3000/getallmodels', options)
            .map((response: Response) => response.json());
    }

    modelDelete(mid: number) {
        const deleteOptions = options;
        deleteOptions.body = {modelid: mid};
        return this.http.delete('http://localhost:3000/modeldelete', deleteOptions)
            .map((response: Response) => response.json());
    }


    modelUpdate(mid: number, modelname: string, lastchange: string, modelxml: string, version: string) {
        return this.http.post('http://localhost:3000/modelupdate', {
            modelid: mid,
            modelname: modelname,
            lastchange: lastchange,
            modelxml: modelxml,
            version: version
        }, options)
            .map((response: Response) => response.json());
    }

    modelCreate(mid: number, modelname: string, lastchange: string, modelxml: string, version: string){
        return this.http.post('http://localhost:3000/modelcreate', {
            modelname: modelname,
            lastchange: lastchange,
            modelxml: modelxml,
            version: version
        }, options)
            .map((response: Response) => response.json());
    }

}