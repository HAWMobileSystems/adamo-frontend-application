import { Injectable } from "@angular/core";
import { Level, Helper } from '../models/level.module';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class LevelService {

    constructor(private httpService: HttpClient){

    }

    // public getLevel() {
    //     return this.httpService.get<Level>('/assets/fixtures/test.json').pipe(
    //         map(data => new Level().deserialize(data))
    //     )
    // }

    // public getLevel(id: number) : Observable<Level> {
    //     return this.httpService.get<Level>("/assets/fixtures/test.json").pipe(
    //         map((levels: Level[]) => levels.map((level: Level) => new Level().deserialize(level))));
    // }

    public getAllLevels() : Observable<Level[]> {
        return this.httpService.get<Level[]>("/assets/fixtures/test.json").pipe(
            map((levels: Level[]) => levels.map((level: Level) => new Level().deserialize(level))));
    }

    // public getLevel(id: number): Observable<Level> {
    //     console.log("test");
    //     return this.httpService.get<Level[]>("/assets/fixtures/test.json").pipe(
    //         map((levels: Level[]) => levels.map((level: Level) => new Level().deserialize(level))))[id];

    // }

    // public getLevels() {
    
    //     let levels: Level[];
    //     let mcObjArrBasic = new Array;
    //     mcObjArrBasic.push(new Helper<string, string[]>("1-Frage Basic 1", ["1-Antwort Basic 1", "1-Antwort Basic 2", "1-Antwort Basic 3"]));
    //     mcObjArrBasic.push(this.createMCObjectArray("2-Frage Basic 1", ["2-Antwort Basic 1", "2-Antwort Basic 2", "2-Antwort Basic 3", "2-Antwort Basic 4"]));

    //     let mcobjarrAdvanced = new Array;
    //     mcobjarrAdvanced.push(this.createMCObjectArray("1-Frage Advanced 1", ["1-Antwort Advanced 1", "1-Antwort Advanced 2", "1-Antwort Advanced 3"]));
    //     mcobjarrAdvanced.push(this.createMCObjectArray("2-Frage Advanced 1", ["2-Antwort Advanced 1", "2-Antwort Advanced 2", "2-Antwort Advanced 3", "2-Antwort Advanced 4"]));

    //     let mcobjarrProfessional= new Array;
    //     mcobjarrProfessional.push(this.createMCObjectArray("1-Frage Professional 1", ["1-Antwort Professional 1", "1-Antwort Professional 2", "1-Antwort Professional 3"]));
    //     mcobjarrProfessional.push(this.createMCObjectArray("2-Frage Professional 1", ["2-Antwort Professional 1", "2-Antwort Professional 2", "2-Antwort Professional 3", "2-Antwort Professional 4"]));

    //     levels = [
    //         new Level(1, "Basic", [1, 2, 3, 4, 5],
    //             ["page 1 with content", "page 2 mit content", "<p>page 3 mit content</p>", "page 4", "page 5 ende Intro"],
    //             mcObjArrBasic),
    //         new Level(2, "Advanced", [1, 2, 3],
    //             ["page 1 with content", "page 2 mit content", "page 3 mit content<p>Ganz viel Text</p> <h1>ende Intro Advanced</h1>"],
    //             mcobjarrAdvanced),
    //         new Level(3, "Professional", [1, 2, 3, 4, 5, 6, 7],
    //             ["page 1 with content", "page 2 mit content", "page 3 mit content", "page 4", "page 5", "page 6", "page 7  ende Intro Pro"],
    //             mcobjarrProfessional)
    //     ]
    
    //     return levels;
    // }


    // createMCObjectArray(quest: string, answers: string[]) {   
    //     let obj = new Helper<string, string[]>(quest, answers);
    //     return obj;;;
    // }

}