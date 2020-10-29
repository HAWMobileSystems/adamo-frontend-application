import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { ModelElement } from '../ModelerComponent/evaluator/modelElement';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import * as moment from 'moment';
import { UserDto } from '../models/dto/UserDTO';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserLoginDto } from '../../client/interface/components/i-user-login-dto';
import { IUserDto } from '../../client/interface/components/i-user-dto';
import { UserWithTokenDto } from '../models/dto/UserWithTokenDTO';
import { NGXLogger } from 'ngx-logger';

const options = {
  withCredentials: true,
};
// options.params.set('withCredentials', 'true');

/**
 * Authentication Service handles the login and registration of users.
 * Uses LocalStorage and Observables to access User from other parts of Application
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserWithTokenDto>;
  public currentUser: Observable<UserWithTokenDto>;
  private BACKEND_URI: string = environment.SERVER_HOST + ':' + environment.SERVER_PORT;
  private CAMUNDA_ENGINE_URI: string = environment.CAMUNDA_ENGINE_HOST + ':' + environment.SERVER_PORT;

  //Session handling: Authentication when user is logging in
  private localStorageCurrentUserKey = 'currentUser';

  constructor(private http: HttpClient, private logger: NGXLogger) {
    this.logger.debug('Constructor Authservice');
    this.currentUserSubject = new BehaviorSubject<UserWithTokenDto>(
      JSON.parse(localStorage.getItem(this.localStorageCurrentUserKey)),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Accessing the currentUserSubject (BehaviorSubject)
   * @returns currentUser as DTO or null
   */
  public getCurrentUser(): UserDto {
    this.logger.trace('AuthService: getCurrentUserWithTokenDto', this.currentUserSubject.value);
    if (!this.currentUserSubject.value) {
      throw new Error('No User');
    }
    return this.currentUserSubject.value.user;
  }

  public getCurrentUserWithTokenDto(): UserWithTokenDto {
    this.logger.trace('AuthService: getCurrentUserWithTokenDto', this.currentUserSubject.value);
    // console.log('called getCurrentUser', this.currentUserSubject.value);
    if (!this.currentUserSubject.value) {
      throw new Error('No User');
    }
    return this.currentUserSubject.value;
  }

  public login(userLoginDto: IUserLoginDto): Observable<UserWithTokenDto> {
    const authLoginRoute = '/auth/login';
    return this.http.post<UserWithTokenDto>(this.BACKEND_URI + authLoginRoute, userLoginDto, options).pipe(
      tap((response: UserWithTokenDto) => {
        localStorage.setItem(this.localStorageCurrentUserKey, JSON.stringify(response));
        this.currentUserSubject.next(response);
        return response;
      }),
    );
  }

  //   register(userRegisterDto: IUserRegisterDto) {
  //     return this.http
  //       .post<>(
  //         "http://www.your-server.com/auth/register",
  //         { email, password }
  //       )
  //       .pipe(
  //         tap((res) => {
  //           this.login(email, password);
  //         })
  //       );
  //   }

  //Session handling: Login status of user
  //   public login_status() {
  //     return this.http.get(this.BACKEND_URI + "/auth/me",options);
  //     //.pipe(map((response: any) => response.json()));
  //   }

  //Session handling: Logout of user
  // public logout() {
  //   return this.http
  //     .get(this.BACKEND_URI + '/logout', {
  //       withCredentials: true
  //      })
  //     //.pipe(map((response: any) => response.json()));
  // }

  //   public getToken(): string {
  //     console.log(localStorage.getItem("accessToken"));
  //     return localStorage.getItem("accessToken");
  //   }
  //   private setSession(token) {
  //     const expiresIn = moment().add(token.expiresIn, "second");

  //     localStorage.setItem("accessToken", token.accessToken);
  //     localStorage.setItem("expiresIn", JSON.stringify(expiresIn.valueOf()));
  //   }

  public logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem(this.localStorageCurrentUserKey);
    this.currentUserSubject.next(null);
  }

  //   public isLoggedIn() {
  //     // return localStorage.getItem('access_token') !==  null;
  //     return moment().isBefore(this.getExpiration());
  //   }

  //   isLoggedOut() {
  //     return !this.isLoggedIn();
  //   }

  //   getExpiration() {
  //     const expiration = localStorage.getItem("expiresIn");
  //     const expiresAt = JSON.parse(expiration);
  //     return moment(expiresAt);
  //   }

  //Administration page: Show all users
  public getAllUsers() {
    return this.http.get(this.BACKEND_URI + '/user/all', options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete user
  public userDelete(uid: number) {
    return this.http.post(this.BACKEND_URI + '/user/delete', { uid: uid }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update user
  public userUpdate(uid: number, email: string, firstname: string, lastname: string, profile: string) {
    return this.http.post(
      this.BACKEND_URI + '/user/update',
      {
        uid: uid,
        email: email,
        firstname: firstname,
        lastname: lastname,
        profile: profile,
      },
      options,
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Change password
  public userPassword(uid: number, password: string) {
    return this.http.post(
      this.BACKEND_URI + '/user/password',
      {
        uid: uid,
        password: password,
      },
      options,
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create user
  public userCreate(email: string, firstname: string, lastname: string, profile: string, password: string) {
    return this.http.post(
      this.BACKEND_URI + '/user/create',
      {
        email: email,
        firstname: firstname,
        lastname: lastname,
        profile: profile,
        password: password,
      },
      options,
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Show all roles
  public getAllRoles() {
    return this.http.get(this.BACKEND_URI + '/role/all', options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete role
  public roleDelete(roleid: number) {
    return this.http.post(this.BACKEND_URI + '/role/delete', { roleid: roleid }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update role
  public roleUpdate(roleid: number, role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(
      this.BACKEND_URI + '/role/update',
      {
        roleid: roleid,
        role: role,
        read: read,
        write: write,
        admin: admin,
      },
      options,
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create role
  public roleCreate(role: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(
      this.BACKEND_URI + '/role/create',
      {
        role: role,
        read: read,
        write: write,
        admin: admin,
      },
      options,
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Show all profiles when creating a new user
  public getAllProfiles() {
    return this.http.get(this.BACKEND_URI + '/profile/all', options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete profile of user
  public profileDelete(profileid: number) {
    return this.http.post(this.BACKEND_URI + '/profile/delete', { profileid: profileid }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update profile of user
  public profileUpdate(profileid: number, profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(
      this.BACKEND_URI + '/profile/update',
      {
        profileid: profileid,
        profile: profile,
        read: read,
        write: write,
        admin: admin,
      },
      options,
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create new profile
  public profileCreate(profile: string, read: boolean, write: boolean, admin: boolean) {
    return this.http.post(
      this.BACKEND_URI + '/profile/create',
      {
        profile: profile,
        read: read,
        write: write,
        admin: admin,
      },
      options,
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete permission
  public permissionDelete(pid: any) {
    return this.http.post(this.BACKEND_URI + '/permission/delete', { pid: pid }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update permission
  public permissionUpdate(role: any, pid: any) {
    return this.http.post(this.BACKEND_URI + '/permission/update', { role: role, pid: pid }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Delete partModel
  public partModelDelete(mid: number, version: string) {
    return this.http.post(this.BACKEND_URI + '/partmodel/delete', { mid: mid, version: version }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Create partModel
  public partModelCreate(mid: string, version: string, pmid: string) {
    return this.http.post(this.BACKEND_URI + '/partmodel/create', { mid: mid, version: version, pmid: pmid }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //get partModels
  public getPartModelUsage(pmid: string) {
    return this.http.post(this.BACKEND_URI + '/partmodel/usage', { pmid: pmid }, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Upload to Camunda Engine
  public uploadToEngine(name: string, modelXML: any) {
    const deploy = require('./deploymenthelper');

    const req = {
      apiUrl: this.CAMUNDA_ENGINE_URI,
      filename: name,
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
