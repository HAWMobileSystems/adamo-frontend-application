import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Language } from '../../models/language.enum'
import { LanguageService } from '../../services/language.service';

@Component({
    selector:'LanguageComponent',
    templateUrl:'./language.component.html',
})
export class LanguageComponent implements OnInit
{
    Language = Language;

    constructor(private langService:LanguageService){}

    ngOnInit(){}

    onChange(deviceValue) {
        this.langService.changeLanguage(deviceValue)
        // window.location.reload()
    }
}
