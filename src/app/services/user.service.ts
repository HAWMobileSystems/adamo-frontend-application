import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IPIM_OPTIONS } from "../modelerConfig.service";
import { ModelElement } from "../ModelerComponent/evaluator/modelElement";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

import { UserDto } from "../models/dto/UserDTO";
const options = {
  withCredentials: true
};
// options.params.set('withCredentials', 'true');
@Injectable()
export class UserService {
  constructor(public http: HttpClient) {}
  private BACKEND_URI: string =
    environment.SERVER_HOST + ":" + environment.SERVER_PORT;
  private CAMUNDA_ENGINE_URI: string = environment.CAMUNDA_ENGINE_HOST;

  //Administration page: Show all users
  public getAllUsers() {
    return this.http.get(this.BACKEND_URI + "/user", options);
  }

  public getAllProfiles() {
    return this.http
      .get(this.BACKEND_URI + '/profile', options)
      //.pipe(map((response: any) => response.json()));
  }
  //Administration page: Delete user
  public userDelete(uid: number) {
    return this.http.post(
      this.BACKEND_URI + "/user/delete",
      { uid: uid },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update user
  public userUpdate(userDTO: UserDto) {
  // public userUpdate(
  //   uid: number,
  //   email: string,
  //   firstname: string,
  //   lastname: string,
  //   profile: string
  // ) {
    return this.http.post(
      this.BACKEND_URI + "/user/update",
      userDTO,
      // {
      //   uid: uid,
      //   email: email,
      //   firstname: firstname,
      //   lastname: lastname,
      //   profile: profile
      // },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Change password
  public changePassword(userDTO: UserDto, password: string) {
  // public changePassword(uid: number, password: string) {
    return this.http.post(
      this.BACKEND_URI + "/user/password",
      {
        uid: userDTO.id,
        password: password
      },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create user
  // this should definitly get an DTO TODO
  public userCreate( userDTO: UserDto) {
    return this.http.post(
      this.BACKEND_URI + "/user/create",
      userDTO,
      // {
      //   email: email,
      //   firstname: firstname,
      //   lastname: lastname,
      //   profile: profile,
      //   password: password
      // },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }
}
