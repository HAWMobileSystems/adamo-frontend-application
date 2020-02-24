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
  
  public getStartview(user_id) {
    // console.log(this.BACKEND_URI + "/intro/startview/" + user_id)
    return this.httpService.get(this.BACKEND_URI + "/intro/startview/" + user_id, options)
  }

  public getContentOfIntro(cat: String, page:number){
    // console.log("Cat: " + cat + ", Page: " + page)
    // console.log(this.httpService.get(this.BACKEND_URI + "/intro/" +  cat + "/" + page))
    return this.httpService.get(this.BACKEND_URI + "/intro/" +  cat + "/" + page)
  }

  public getMultipleChoice(userid, categorie){
    console.log(userid + "- " + categorie)
    // http://localhost:3330/tg_multiplechoice/getMultiplechoice/{user_id}/{cat}
    return this.httpService.get(this.BACKEND_URI + "/tg_multiplechoice/getMultiplechoice/" + userid + "/" + categorie)
  }

  public postIntroFinish(userid, categorie){
    this.httpService.put(this.BACKEND_URI + "/tg_intro/" +  userid + "/" + categorie, options)
  }

}