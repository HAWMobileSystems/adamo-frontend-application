import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs';
import { Language } from '../models/language.enum';

@Injectable()
export class LanguageService {

  private langSource = new BehaviorSubject<Language>(Language.en)
  
  lang$ = this.langSource.asObservable()
  
  changeLanguage(language) {
    // window.location.reload()
    this.langSource.next(language)
  }
}