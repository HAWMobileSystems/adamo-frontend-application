import {Injectable} from '@angular/core';
import {RequestOptions, Http, Response} from "@angular/http";

import 'rxjs/add/operator/map'

const options = new RequestOptions({withCredentials: true});

@Injectable()
export class ApiService {
  constructor(private http: Http) {
  }


  authenticate(email: string, password: string, captcha: string) {
    return this.http.post(
      'http://localhost:3000/authenticate',
      {
        email: email,
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
    return this.http.get('http://localhost:3000/user/all', options)
      .map((response: Response) => response.json());
  }

  userDelete(uid: number) {
    // var deleteOptions = options;
    // deleteOptions.body = {uid: uid};
    return this.http.post('http://localhost:3000/user/delete', {uid: uid}, options)
      .map((response: Response) => response.json());
  }

  userUpdate(uid: number, email:string, firstname: string, lastname: string, profile: string) {
    return this.http.post('http://localhost:3000/user/update', {
      uid: uid,
      email: email,
      firstname: firstname,
      lastname: lastname,
      profile: profile,
    }, options)
      .map((response: Response) => response.json());
  }

  userPassword(uid: number, password: string) {
    return this.http.post('http://localhost:3000/user/update', {
      uid: uid,
      password: password,
    }, options)
      .map((response: Response) => response.json());
  }

  userCreate(email:string, firstname: string, lastname: string, profile: string, password: string) {
    return this.http.post('http://localhost:3000/user/create', {
      email: email,
      firstname: firstname,
      lastname: lastname,
      profile: profile,
      password: password
    }, options)
      .map((response: Response) => response.json());
  }


  getAllRoles() {
    return this.http.get('http://localhost:3000/role/all', options)
      .map((response: Response) => response.json());
  }

  roleDelete(roleid: number) {
    const deleteOptions = options;
    deleteOptions.body = {roleid: roleid};
    return this.http.post('http://localhost:3000/role/delete', {roleid: roleid}, options)
      .map((response: Response) => response.json());
  }

  roleUpdate(roleid: number, role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/role/update', {
      roleid: roleid,
      role: role,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  roleCreate(role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/role/create', {
      role: role,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }


  getAllProfiles() {
    return this.http.get('http://localhost:3000/profile/all', options)
      .map((response: Response) => response.json());
  }

  profileDelete(profileid: number) {
    //const deleteOptions = options;
    //deleteOptions.body = {profileid: profileid};
    return this.http.post('http://localhost:3000/profile/delete',{profileid: profileid}, options)
      .map((response: Response) => response.json());
  }

  profileUpdate(profileid: number, profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/profile/update', {
      profileid: profileid,
      profile: profile,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  profileCreate(profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/profile/create', {
      profile: profile,
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
    return this.http.get('http://localhost:3000/model/all', options)
      .map((response: Response) => response.json());
  }

  modelDelete(mid: number) {
    //const deleteOptions = options;
    //options.body = {modelid: mid};
    return this.http.post('http://localhost:3000/model/delete', {mid: mid}, options)
      .map((response: Response) => response.json());
  }


  modelUpdate(mid: number, modelname: string, lastchange: string, modelxml: string, version: string) {
    return this.http.post('http://localhost:3000/model/update', {
      mid: mid,
      modelname: modelname,
      lastchange: lastchange,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  modelCreate(modelname: string, lastchange: string, modelxml: string, version: string) {
    return this.http.post('http://localhost:3000/model/create', {
      modelname: modelname,
      lastchange: lastchange,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  getPermission(user: any, model: any){
    return this.http.get('http://localhost:3000/permission/'+user+'/'+model, options)
      .map((response: Response) => response.json());
  }

  permissionCreate(uid: any, mid: any, role:any){
    return this.http.post('http://localhost:3000/permission/create', {uid: uid, mid: mid, role: role}, options)
      .map((response: Response) => response.json());
  }

  permissionDelete(pid: any){
    return this.http.post('http://localhost:3000/permission/delete', {pid: pid}, options)
        .map((response: Response) => response.json());
    }

  permissionUpdate(uid: any, mid: any, rid:any, pid: any){
    return this.http.post('http://localhost:3000/permission/update', {uid: uid, mid: mid, rid: rid, pid: pid}, options)
      .map((response: Response) => response.json());
  }
}