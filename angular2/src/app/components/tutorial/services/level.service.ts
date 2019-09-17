import { Injectable } from "@angular/core";
import { Level, Helper } from '../models/Level';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";


@Injectable()
export class LevelService {

    public parsedLVL: Level;

    constructor(private http: HttpClient){
       this.getJSON().subscribe(data => this.createLevelFromJson(data));
    }

    public getJSON(): Observable<any> {
        return this.http.get("/assets/fixtures/test.json", { responseType: 'json'});
    }

    public createLevelFromJson(j_string){
        //j_string is our parsed json 
        console.log(j_string)
        //Create Object from json
        let lvl_obj = new Level(j_string.levelID,j_string.name, j_string.page, j_string.PageDesc, j_string.MCTest)
        //Add lvl to LVLs array
        this.parsedLVL = lvl_obj;
        

    }


    public getLevels() {
        let levels: Level[];
        let mcObjArrBasic = new Array;
        mcObjArrBasic.push(new Helper<string, string[]>("1-Frage Basic 1", ["1-Antwort Basic 1", "1-Antwort Basic 2", "1-Antwort Basic 3"]));
        mcObjArrBasic.push(this.createMCObjectArray("2-Frage Basic 1", ["2-Antwort Basic 1", "2-Antwort Basic 2", "2-Antwort Basic 3", "2-Antwort Basic 4"]));

        let mcobjarrAdvanced = new Array;
        mcobjarrAdvanced.push(this.createMCObjectArray("1-Frage Advanced 1", ["1-Antwort Advanced 1", "1-Antwort Advanced 2", "1-Antwort Advanced 3"]));
        mcobjarrAdvanced.push(this.createMCObjectArray("2-Frage Advanced 1", ["2-Antwort Advanced 1", "2-Antwort Advanced 2", "2-Antwort Advanced 3", "2-Antwort Advanced 4"]));

        let mcobjarrProfessional= new Array;
        mcobjarrProfessional.push(this.createMCObjectArray("1-Frage Professional 1", ["1-Antwort Professional 1", "1-Antwort Professional 2", "1-Antwort Professional 3"]));
        mcobjarrProfessional.push(this.createMCObjectArray("2-Frage Professional 1", ["2-Antwort Professional 1", "2-Antwort Professional 2", "2-Antwort Professional 3", "2-Antwort Professional 4"]));


        levels = [
            new Level(1, "Basic", [1, 2, 3, 4, 5],
                ["page 1 with content", "page 2 mit content", "<p>page 3 mit content</p>", "page 4", "page 5 ende Intro"],
                mcObjArrBasic),
            new Level(2, "Advanced", [1, 2, 3],
                ["page 1 with content", "page 2 mit content", "page 3 mit content<p>Ganz viel Text</p> <h1>ende Intro Advanced</h1>"],
                mcobjarrAdvanced),
            new Level(3, "Professional", [1, 2, 3, 4, 5, 6, 7],
                ["page 1 with content", "page 2 mit content", "page 3 mit content", "page 4", "page 5", "page 6", "page 7  ende Intro Pro"],
                mcobjarrProfessional)
        ]
        //Push parsed LVL to Levels array
        levels.push(this.parsedLVL)
        return levels;
    }

    createMCObjectArray(quest: string, answers: string[]) {   
        let obj = new Helper<string, string[]>(quest, answers);
        return obj;;;
    }

    public getLevel(id) {
        let levels: Level[] = this.getLevels();
        return levels.find(p => p.levelID == id);
    }
}