import {Injectable} from '@angular/core';
import {RequestOptions, Http, Response} from '@angular/http';
import {IPIM_OPTIONS} from '../modelerConfig.service';
import { ModelElement } from '../ModelerComponent/evaluator/modelElement';

const options = new RequestOptions({withCredentials: true});

@Injectable()
export class ApiService {
  constructor(public http: Http) {
  }

  //Session handling: Authentication when user is logging in
  public authenticate(email: string, password: string) {
    return this.http.post(
      IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/authenticate',
      {
        email: email,
        password: password
      },
      options)
      .map((response: Response) => response.json());
  }

  //Session handling: Login status of user
  public login_status() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/login_status', options)
      .map((response: Response) => response.json());
  }

  //Session handling: Logout of user
  public logout() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/logout', options)
      .map((response: Response) => response.json());
  }

  //Administration page: Show all users
  public getAllUsers() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/all', options)
      .map((response: Response) => response.json());
  }

  //Administration page: Delete user
  public userDelete(uid: number) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/delete', {uid: uid}, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Update user
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

  //Administration page: Change password
  public userPassword(uid: number, password: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/user/password', {
      uid: uid,
      password: password
    }, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Create user
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

  //Administration page: Show all roles
  public getAllRoles() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/role/all', options)
      .map((response: Response) => response.json());
  }

  //Administration page: Delete role
  public roleDelete(roleid: number) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/role/delete', {roleid: roleid}, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Update role
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

  //Administration page: Create role
  public roleCreate(role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/role/create', {
      role: role,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Show all profiles when creating a new user
  public getAllProfiles() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/profile/all', options)
      .map((response: Response) => response.json());
  }

  //Administration page: Delete profile of user
  public profileDelete(profileid: number) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/profile/delete', {profileid: profileid}, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Update profile of user
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

  //Administration page: Create new profile
  public profileCreate(profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/profile/create', {
      profile: profile,
      read: read,
      write: write,
      admin: admin
    }, options)
      .map((response: Response) => response.json());
  }

  //Modeller: Load model
  public getModel(mid: string, version?: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/getModel', {mid: mid, version: version}, options)
      .map((response: Response) => response.json());
  }

  //Modeller: Evaluation needs asynchron loading of model
  public async getModelAsync(mid: string): Promise<ModelElement> {
    const response = await this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/getModel', {mid: mid}, options).toPromise();
    return new ModelElement(response.json().data.modelname, response.json().data.mid.toString(), response.json().data.modelxml);
  }

  //Administration page: Show all models
  //modellerPage: Show all models
  public getAllModels() {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/all', options)
      .map((response: Response) => response.json());
  }

  //Administration page: Delete model
  public modelDelete(mid: number, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/delete', {mid: mid, version: version}, options)
      .map((response: Response) => response.json());
  }

  //Modeller: Update model triggers insert of a new database entry with new version number (upsert)
  public modelUpsert(mid: number, modelname: string, modelxml: string, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/upsert', {
      mid: mid,
      modelname: modelname,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Update model information
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

  //Administration page: Create a new model
  //modellerPage: Create a new model
  public modelCreate(modelname: string, lastchange: string, modelxml: string, version: string) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/model/create', {
      modelname: modelname,
      lastchange: lastchange,
      modelxml: modelxml,
      version: version
    }, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Get permission
  //Modeller: Get permission
  public getPermission(user: any, model: any) {
    return this.http.get(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/' + user + '/' + model, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Create permission
  public permissionCreate(uid: any, mid: any, role: any) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/create', {uid: uid, mid: mid, role: role}, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Delete permission
  public permissionDelete(pid: any) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/delete', {pid: pid}, options)
      .map((response: Response) => response.json());
  }

  //Administration page: Update permission
  public permissionUpdate(role: any, pid: any) {
    return this.http.post(IPIM_OPTIONS.EXPRESSJS_CONNECTION + '/permission/update', {role: role, pid: pid}, options)
      .map((response: Response) => response.json());
  }
}