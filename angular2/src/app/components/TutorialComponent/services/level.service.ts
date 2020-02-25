import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { environment } from "./../../../../environments/environment";
import { Language } from "../models/language.enum"

const options = {
  withCredentials: true
};

@Injectable()
export class LevelService {

  private BACKEND_URI: string = environment.SERVER_HOST + ":" + environment.SERVER_PORT;
  private lang: Language

  constructor(private httpService: HttpClient) {
    // TODO implement 
    this.lang = Language.de  
  }

  
  public getStartview(user_id, lang) {
    return this.httpService.get(this.BACKEND_URI + "/intro/startview/" + user_id + "/" + lang, options)
  }

  public getContentOfIntro(lang, cat: String, page:number){
    console.log(this.BACKEND_URI + "/intro/" +  cat + "/" + page + "/" + lang)
    return this.httpService.get(this.BACKEND_URI + "/intro/" +  cat + "/" + page + "/" + lang, options)
  }

  public getMultipleChoice(userid, categorie){
    return this.httpService.get(this.BACKEND_URI + "/tg_multiplechoice/getMultiplechoice/" + userid + "/" + categorie, options)
  }

  public postIntroFinish(userid, categorie){
    this.httpService.post(this.BACKEND_URI + "/tg_intro/" +  userid + "/" + categorie, options)
  }

  postMultipleChoice(user_choice: any) {
    // this.httpService.post(this.BACKEND_URI + "", options)
  }
}