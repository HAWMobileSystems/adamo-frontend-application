import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { ModelElement } from '../ModelerComponent/evaluator/modelElement';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { UserDto } from '../models/dto/UserDTO';
import { Observable } from 'rxjs';
const options = {
  withCredentials: true,
};
// options.params.set('withCredentials', 'true');
@Injectable()
export class UserService {
  constructor(public http: HttpClient) {}

  private BACKEND_URI = `${environment.SERVER_HOST}:${environment.SERVER_PORT}`;

  /**
   * @returns an Array of UserDto
   */
  public getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.BACKEND_URI + '/user', options);
  }

  /**
   * @returns an Array of User Profiles
   */
  public getAllProfiles() {
    return this.http.get(this.BACKEND_URI + '/profile', options);
  }

  /**
   * @param {string} uid: ID of a spedific user
   * @returns the result of the userdeletion
   */
  public userDelete(uid: string) {
    return this.http.post(this.BACKEND_URI + '/user/delete', { uid: uid }, options);
  }

  //Administration page: Update user
  public userUpdate(userDTO: UserDto) {
    return this.http.post(this.BACKEND_URI + '/user/update', userDTO, options);
  }

  //Administration page: Change password
  public changePassword(userDTO: UserDto, password: string) {
    // public changePassword(uid: number, password: string) {
    return this.http.put(
      this.BACKEND_URI + '/user/password',
      {
        uid: userDTO.id,
        password: password,
      },
      options,
    );
  }

  //Administration page: Create user
  // this should definitly get an DTO TODO
  public userCreate(userDTO: UserDto) {
    return this.http.post(this.BACKEND_URI + '/user/create', userDTO, options);
  }
}
