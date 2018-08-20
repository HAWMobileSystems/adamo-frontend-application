import {Injectable} from '@angular/core';
import {RequestOptions, Http, Response} from '@angular/http';
import {IPIM_OPTIONS} from '../modelerConfig.service';

const options = new RequestOptions({withCredentials: true});

@Injectable()
export class ApiService {
  constructor(public http: Http) {
  }

  public authenticate(email: string, password: string, captcha: string) {
    return this.http.post(
      IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/authenticate',
      {
        email: email,
        password: password,
        captcha: captcha
      },
      options)
      .map((response: Response) => response.json());
  }

  public login_status() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/login_status', options)
      .map((response: Response) => response.json());
  }

  public logout() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/logout', options)
      .map((response: Response) => response.json());
  }

  public getAllUsers() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/all', options)
      .map((response: Response) => response.json());
  }

  public userDelete(uid: number) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/delete', {uid: uid}, options)
      .map((response: Response) => response.json());
  }

  public userUpdate(uid: number, email: string, firstname: string, lastname: string, profile: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/update', {
      uid: uid,
      email: email,
      firstname: firstname,
      lastname: lastname,
      profile: profile
    }, options)
      .map((response: Response) => response.json());
  }

  public userPassword(uid: number, password: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/password', {
      uid: uid,
      password: password
    }, options)
      .map((response: Response) => response.json());
  }

  public userCreate(email: string, firstname: string, lastname: string, profile: string, password: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/create', {
      email: email,
      firstname: firstname,
      lastname: lastname,
      profile: profile,
      password: password
    }, options)
      .map((response: Response) => response.json());
  }

  public getAllRoles() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/role/all', options)
      .map((response: Response) => response.json());
  }

  public roleDelete(roleid: number) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/role/delete', {roleid: roleid}, options)
      .map((response: Response) => response.json());
  }

  public roleUpdate(roleid: number, role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/role/update', {
      roleid: roleid,
      role: role,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public roleCreate(role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/role/create', {
      role: role,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public getAllProfiles() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/profile/all', options)
      .map((response: Response) => response.json());
  }

  public profileDelete(profileid: number) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/profile/delete', {profileid: profileid}, options)
      .map((response: Response) => response.json());
  }

  public profileUpdate(profileid: number, profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/profile/update', {
      profileid: profileid,
      profile: profile,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public profileCreate(profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/profile/create', {
      profile: profile,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  public getModel(mid: string, version?: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/getModel', {mid: mid, version: version}, options)
      .map((response: Response) => response.json());
  }

  public async getModelAsync(mid: string): Promise<string> {
    const response = await this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/getModel/' + mid, options).toPromise();
    return response.json().data.modelxml;
  }

  public getAllModels() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/all', options)
      .map((response: Response) => response.json());
  }

  public modelDelete(mid: number, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/delete', {mid: mid, version: version}, options)
      .map((response: Response) => response.json());
  }

  public modelUpsert(mid: number, modelname: string, modelxml: string, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/upsert', {
      mid: mid,
      modelname: modelname,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  public modelUpdate(mid: number, modelname: string, lastchange: string, modelxml: string, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/update', {
      mid: mid,
      modelname: modelname,
      lastchange: lastchange,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  public modelClose(mid: number, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/close', {
      mid: mid,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  public modelCreate(modelname: string, lastchange: string, modelxml: string, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/create', {
      modelname: modelname,
      lastchange: lastchange,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  public getPermission(user: any, model: any) {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/' + user + '/' + model, options)
      .map((response: Response) => response.json());
  }

  public permissionCreate(uid: any, mid: any, role: any) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/create', {
      uid: uid,
      mid: mid,
      role: role
    }, options)
      .map((response: Response) => response.json());
  }

  public permissionDelete(pid: any) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/delete', {pid: pid}, options)
      .map((response: Response) => response.json());
  }

  public permissionUpdate(role: any, pid: any) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/update', {role: role, pid: pid}, options)
      .map((response: Response) => response.json());
  }
}