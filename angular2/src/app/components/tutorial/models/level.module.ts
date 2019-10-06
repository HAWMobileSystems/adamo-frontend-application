import { Serializable } from "./serializable.model";

export class Helper<T1, T2> implements Serializable {
    public key: T1;
    public value: T2;


    //HACKY 
    //INSERTED TO ENABLE PUTTING HTML CODE INCLUDING '"' 
    //AND PARSE IT FROM JSON
    //IT WILL REPLACE §§ BY "
    deserialize(input: any): this {
        var regexExpr = new RegExp("(§§)","gm");
        var exchangeExpr = '"';
        var realStr = input.value
        if(regexExpr.test(input.value)){
            input.value = realStr.replace(regexExpr, exchangeExpr)
        }
        return Object.assign(this, input);
              
    }
}

export class MultipleChoiceTask {
    mcQestionID: number;
    mcQuestion: string;
    mcAnswers: string[];
}

export class ModellerTasks implements Serializable {
    taskID: number;
    taskName: string;
    taskDesc: string;
    // taskView: XMLDocument;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}


export class Level implements Serializable {

    // Generell Setting
    public levelID: number;
    public name: string;

    // Introduction
    public PageDesc: Helper<number,string>[] = new Array;

    // Test Multiple Choice one Test per Level
    public MCTest: Helper<string, string[]>[] = new Array;

    // Array of Tasks to Model
    public ModTest: ModellerTasks[] = new Array;

    constructor(){
        
    }

    deserialize(input: any) {
        Object.assign(this, input);
        this.PageDesc = input.PageDesc.map((data: Helper<number, string>) => new Helper<number, string>().deserialize(data));
        this.MCTest = input.MCTest.map((data:Helper<number, string[]>) => new Helper<number, string[]>().deserialize(data));
        // this.ModTest = input.ModTest.map((data:ModellerTasks) => new ModellerTasks().deserialize(data));
        return this;
    }

}

