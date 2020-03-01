import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { environment } from "./../../../../environments/environment";
import { Language } from "../models/language.enum"
import { injectRootLimpMode } from "@angular/core/src/di/injector_compatibility";
import { RequestOptions } from "@angular/http";

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

  public getContentOfIntro(lang, cat: String, page: number) {
    console.log(this.BACKEND_URI + "/intro/" + cat + "/" + page + "/" + lang)
    return this.httpService.get(this.BACKEND_URI + "/intro/" + cat + "/" + page + "/" + lang, options)
  }

  public getMultipleChoice(userid, categorie, lang) {
    return this.httpService.get(this.BACKEND_URI + "/tg_multiplechoice/getMultiplechoice/" + userid + "/" + categorie + "/" + lang, options)
  }

  public getModellingTask(taskid, lang) {
    console.log(this.BACKEND_URI + "tg_modelling/question/" + taskid + "/" + lang)
    return this.httpService.get(this.BACKEND_URI + "/tg_modelling/question/" + taskid + "/" + lang)
  }

  public postIntroFinish(userid, categorie) {
    console.log("hier ist start post intro finish")
    let header = new HttpHeaders()
    header.set('Content-Type','application/x-www-form-urlencoded')
    console.log(header)
    this.httpService
      .post<any>(
        this.BACKEND_URI + "/tg_intro/",
        {
          'userid': userid,
          'catName': categorie,
          'tg_intro_is_finished': true
        },
        {
          headers: header,
          withCredentials: true
        }
      ).subscribe(resp => {
        // console.log("response of intro post: " + resp)
        //todo errorcheck
      })
  }

  postMultipleChoice(user_choice: any) {
    let header = new HttpHeaders()
    header.set('Content-Type','application/x-www-form-urlencoded')

    return this.httpService
      .post<any>(
        this.BACKEND_URI + "/tg_multiplechoice/solve/",
        {

          user_choice: user_choice
        },
        {
          headers: header,
          withCredentials: true
        }
      )
  }
  
  postModellingQuestion(xml: any,user_id,qs_id,lang) {
    console.log("PostModellingQUestion")
    let header = new HttpHeaders()
    header.set('Content-Type','application/x-www-form-urlencoded')

    return this.httpService
      .post<any>(
        this.BACKEND_URI + "/tg_modelling/solve/" + lang,
        {
          'userid': user_id,
          'qs_id': qs_id,
          'xml': xml
        },
        {
          headers: header,
          withCredentials: true
        }
      )
  }
}