import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { ModelElement } from '../ModelerComponent/evaluator/modelElement';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const options = {
  withCredentials: true
 }
// options.params.set('withCredentials', 'true');
@Injectable()
export class ApiService {
  constructor(public http: HttpClient ) {}
  private BACKEND_URI: string =
    environment.SERVER_HOST + ':' + environment.SERVER_PORT;
  private CAMUNDA_ENGINE_URI: string = environment.CAMUNDA_ENGINE_HOST;

  //Session handling: Authentication when user is logging in
  public authenticate(email: string, password: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/authenticate',
        {
          email: email,
          password: password
        },
         {
          withCredentials: true
         }
      )
      //.pipe(map((response: any) => {
      //   return response.json();
      // }));
  }

  //Session handling: Login status of user
  public login_status() {
    return this.http
      .get(this.BACKEND_URI + '/login_status', {
        withCredentials: true
       })
      //.pipe(map((response: any) => response.json()));
  }

  //Session handling: Logout of user
  public logout() {
    return this.http
      .get(this.BACKEND_URI + '/logout', {
        withCredentials: true
       })
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Show all users
  public getAllUsers() {
    return this.http
      .get(this.BACKEND_URI + '/user/all', options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete user
  public userDelete(uid: number) {
    return this.http
      .post(this.BACKEND_URI + '/user/delete', { uid: uid }, options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update user
  public userUpdate(
    uid: number,
    email: string,
    firstname: string,
    lastname: string,
    profile: string
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/user/update',
        {
          uid: uid,
          email: email,
          firstname: firstname,
          lastname: lastname,
          profile: profile
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Change password
  public userPassword(uid: number, password: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/user/password',
        {
          uid: uid,
          password: password
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create user
  public userCreate(
    email: string,
    firstname: string,
    lastname: string,
    profile: string,
    password: string
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/user/create',
        {
          email: email,
          firstname: firstname,
          lastname: lastname,
          profile: profile,
          password: password
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Show all roles
  public getAllRoles() {
    return this.http
      .get(this.BACKEND_URI + '/role/all', options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete role
  public roleDelete(roleid: number) {
    return this.http
      .post(this.BACKEND_URI + '/role/delete', { roleid: roleid }, options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update role
  public roleUpdate(
    roleid: number,
    role: string,
    read: boolean,
    write: boolean,
    admin: boolean
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/role/update',
        {
          roleid: roleid,
          role: role,
          read: read,
          write: write,
          admin: admin
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create role
  public roleCreate(
    role: string,
    read: boolean,
    write: boolean,
    admin: boolean
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/role/create',
        {
          role: role,
          read: read,
          write: write,
          admin: admin
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Show all profiles when creating a new user
  public getAllProfiles() {
    return this.http
      .get(this.BACKEND_URI + '/profile/all', options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete profile of user
  public profileDelete(profileid: number) {
    return this.http
      .post(
        this.BACKEND_URI + '/profile/delete',
        { profileid: profileid },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update profile of user
  public profileUpdate(
    profileid: number,
    profile: string,
    read: boolean,
    write: boolean,
    admin: boolean
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/profile/update',
        {
          profileid: profileid,
          profile: profile,
          read: read,
          write: write,
          admin: admin
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create new profile
  public profileCreate(
    profile: string,
    read: boolean,
    write: boolean,
    admin: boolean
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/profile/create',
        {
          profile: profile,
          read: read,
          write: write,
          admin: admin
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Modeller: changes to model in last 7 days
  public getModelsChangedLast7Days() {
    return this.http
      .get(this.BACKEND_URI + '/model/changes', options)
      //.pipe(map((response: any) => response.json()));
  }

  //Modeller: Load model
  public getModel(mid: string, version?: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/model/getModel',
        { mid: mid, version: version },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Modeller: Evaluation needs asynchron loading of model
  public async getModelAsync(mid: string): Promise<ModelElement> {
    try {
      const response: any = await this.http
        .post(this.BACKEND_URI + '/model/getModel', { mid: mid }, options)
        .toPromise();
      const responseString = String.fromCharCode.apply(null, new Uint8Array(response));
      return new ModelElement(
        responseString.json().data.modelname,
        responseString.json().data.mid.toString(),
        responseString.json().data.modelxml
      );
    } catch {
      return new ModelElement('', '', '');
    }
  }

  //Administration page: Show all models
  //modellerPage: Show all models
  public getAllModels() {
    return this.http
      .get(this.BACKEND_URI + '/model/all', options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete model
  public modelDelete(mid: number, version: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/model/delete',
        { mid: mid, version: version },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Modeller: Update model triggers insert of a new database entry with new version number (upsert)
  public modelUpsert(
    mid: number,
    modelname: string,
    modelxml: string,
    version: string
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/model/upsert',
        {
          mid: mid,
          modelname: modelname,
          modelxml: modelxml,
          version: version
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update model information
  public modelUpdate(
    mid: number,
    modelname: string,
    lastchange: string,
    modelxml: string,
    version: string
  ) {
    return this.http
      .post(
        this.BACKEND_URI + '/model/update',
        {
          mid: mid,
          modelname: modelname,
          lastchange: lastchange,
          modelxml: modelxml,
          version: version
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }
  public modelClose(mid: number, version: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/model/close',
        {
          mid: mid,
          version: version
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create a new model
  //modellerPage: Create a new model
  public modelCreate(modelname: string, modelxml: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/model/create',
        {
          modelname: modelname,
          modelxml: modelxml
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Get permission
  //Modeller: Get permission
  public getPermission(user: any, model: any) {
    return this.http
      .get(this.BACKEND_URI + '/permission/' + user + '/' + model, options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create permission
  public permissionCreate(uid: any, mid: any, role: any) {
    return this.http
      .post(
        this.BACKEND_URI + '/permission/create',
        {
          uid: uid,
          mid: mid,
          role: role
        },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete permission
  public permissionDelete(pid: any) {
    return this.http
      .post(this.BACKEND_URI + '/permission/delete', { pid: pid }, options)
      //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update permission
  public permissionUpdate(role: any, pid: any) {
    return this.http
      .post(
        this.BACKEND_URI + '/permission/update',
        { role: role, pid: pid },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Delete partModel
  public partModelDelete(mid: number, version: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/partmodel/delete',
        { mid: mid, version: version },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //Create partModel
  public partModelCreate(mid: string, version: string, pmid: string) {
    return this.http
      .post(
        this.BACKEND_URI + '/partmodel/create',
        { mid: mid, version: version, pmid: pmid },
        options
      )
      //.pipe(map((response: any) => response.json()));
  }

  //get partModels
  public getPartModelUsage(pmid: string) {
    return this.http
      .post(this.BACKEND_URI + '/partmodel/usage', { pmid: pmid }, options)
      //.pipe(map((response: any) => response.json()));
  }

  //Upload to Camunda Engine
  public uploadToEngine(name: string, modelXML: any) {
    const deploy = require('./deploymenthelper');

    const req = {
      apiUrl: this.CAMUNDA_ENGINE_URI,
      filename: name
    };

    deploy(req, modelXML, (err: any, res: any) => {
      if (err) {
        console.log('ERROR DEPLOYING', err);
        // TODO: log error
      } else {
        console.log('Success', res);
      }
    });

    // const headerDict = {
    //   'Content-Type': 'multipart/form-data'
    // };

    // const requestOptions = {
    //   headers: new Headers(headerDict)
    // };
    // return this.http.post(IPIM_OPTIONS.ENGINE_CONNECTION, {
    //   upload:
    //     { value: modelXML,
    //       options:
    //        { filename: 'diagramm model_23_1407374883553280.bpmn',
    //          contentType: null } }
    //   // 'upload': modelXML
    //   // 'deployment-name': name,
    //   // 'enable-duplicate-filtering': false,
    //   // 'deploy-changed-only': false,
    //   // 'deployment-source': 'local',
    //   // 'tenant-id': tenantId,
    //   // 'pay_taxes.bpmn': modelXML
    // }, requestOptions)
    //   //.pipe(map((response: any) => response.json());
  }
}
