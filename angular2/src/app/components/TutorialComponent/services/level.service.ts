import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { environment } from "./../../../../environments/environment";
const options = {
  withCredentials: true
};

@Injectable()
export class LevelService {

  // testing demo users id: 650dd7e6-3e0b-4409-9185-fe04a5b5349e
  // private user_id: String

  constructor(private httpService: HttpClient) {
    // this.user_id = '650dd7e6-3e0b-4409-9185-fe04a5b5349e'
   }

  private BACKEND_URI: string = environment.SERVER_HOST + ":" + environment.SERVER_PORT;
  private CAMUNDA_ENGINE_URI: string = environment.CAMUNDA_ENGINE_HOST;

  public startview(user_id) {
    console.log(this.BACKEND_URI + "/intro/startview/" + user_id)
    return this.httpService.get(this.BACKEND_URI + "/intro/startview/" + user_id, options)
  }

  public contentOfIntro(cat: String, page:Number){
    console.log("Cat: " + cat + ", Page: " + page)
    return this.httpService.get(this.BACKEND_URI + "/intro/" +  cat + "/" + page)
  }

}