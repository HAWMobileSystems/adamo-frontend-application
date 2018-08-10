import {Injectable} from '@angular/core';
import {RequestOptions, Http, Response} from '@angular/http';

const options = new RequestOptions({withCredentials: true});

@Injectable()
export class ApiService {
  constructor(public http: Http) {
  }

  public authenticate(email: string, password: string, captcha: string) {
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

  public login_status() {
    return this.http.get('http://localhost:3000/login_status', options)
      .map((response: Response) => response.json());
  }

  public logout() {
    return this.http.get('http://localhost:3000/logout', options)
      .map((response: Response) => response.json());
  }

  public getAllUsers() {
    return this.http.get('http://localhost:3000/user/all', options)
      .map((response: Response) => response.json());
  }

  public userDelete(uid: number) {
    return this.http.post('http://localhost:3000/user/delete', {uid: uid}, options)
      .map((response: Response) => response.json());
  }

  public userUpdate(uid: number, email: string, firstname: string, lastname: string, profile: string) {
    return this.http.post('http://localhost:3000/user/update', {
      uid: uid,
      email: email,
      firstname: firstname,
      lastname: lastname,
      profile: profile
    }, options)
      .map((response: Response) => response.json());
  }

  public userPassword(uid: number, password: string) {
    return this.http.post('http://localhost:3000/user/password', {
      uid: uid,
      password: password
    }, options)
      .map((response: Response) => response.json());
  }

  public userCreate(email: string, firstname: string, lastname: string, profile: string, password: string) {
    return this.http.post('http://localhost:3000/user/create', {
      email: email,
      firstname: firstname,
      lastname: lastname,
      profile: profile,
      password: password
    }, options)
      .map((response: Response) => response.json());
  }

  public getAllRoles() {
    return this.http.get('http://localhost:3000/role/all', options)
      .map((response: Response) => response.json());
  }

  public roleDelete(roleid: number) {
    return this.http.post('http://localhost:3000/role/delete', {roleid: roleid}, options)
      .map((response: Response) => response.json());
  }

  public roleUpdate(roleid: number, role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/role/update', {
      roleid: roleid,
      role: role,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public roleCreate(role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/role/create', {
      role: role,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public getAllProfiles() {
    return this.http.get('http://localhost:3000/profile/all', options)
      .map((response: Response) => response.json());
  }

  public profileDelete(profileid: number) {
    return this.http.post('http://localhost:3000/profile/delete', {profileid: profileid}, options)
      .map((response: Response) => response.json());
  }

  public profileUpdate(profileid: number, profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/profile/update', {
      profileid: profileid,
      profile: profile,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public profileCreate(profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post('http://localhost:3000/profile/create', {
      profile: profile,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public getModel(mid: string) {
    return this.http.post('http://localhost:3000/model/getModel', {mid: mid}, options)
      .map((response: Response) => response.json());
  }

  public async getModelAsync(mid: string): Promise<string> {
    const response = await this.http.get('http://localhost:3000/model/getModel/' + mid, options).toPromise();
    return response.json().data.modelxml;
  }

  public getAllModels() {
    return this.http.get('http://localhost:3000/model/all', options)
      .map((response: Response) => response.json());
  }

  public modelDelete(mid: number) {
    return this.http.post('http://localhost:3000/model/delete', {mid: mid}, options)
      .map((response: Response) => response.json());
  }

  public modelUpdate(mid: number, modelname: string, lastchange: string, modelxml: string, version: string) {
    return this.http.post('http://localhost:3000/model/update', {
      mid: mid,
      modelname: modelname,
      lastchange: lastchange,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  public modelCreate(modelname: string, lastchange: string, modelxml: string, version: string) {
    return this.http.post('http://localhost:3000/model/create', {
      modelname: modelname,
      lastchange: lastchange,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  public getPermission(user: any, model: any) {
    return this.http.get('http://localhost:3000/permission/' + user + '/' + model, options)
      .map((response: Response) => response.json());
  }

  public permissionCreate(uid: any, mid: any, role: any) {
    return this.http.post('http://localhost:3000/permission/create', {uid: uid, mid: mid, role: role}, options)
      .map((response: Response) => response.json());
  }

  public permissionDelete(pid: any) {
    return this.http.post('http://localhost:3000/permission/delete', {pid: pid}, options)
      .map((response: Response) => response.json());
  }

  public permissionUpdate(role: any, pid: any) {
    return this.http.post('http://localhost:3000/permission/update', {role: role, pid: pid}, options)
      .map((response: Response) => response.json());
  }
}