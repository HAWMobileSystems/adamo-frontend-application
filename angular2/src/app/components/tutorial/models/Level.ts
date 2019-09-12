
export class Helper<T1, T2> {
    private key: T1;
    private value: T2;

    constructor(key: T1, value: T2){
        this.key=key;
        this.value=value;
    }

    public getKey(){
        return this.key;
    }

    public getValue(){
        return this.value;
    }
}


export class Level {

    // Generell Setting
    levelID: number;
    name: string;

    // Introduction
    PageDesc: Helper<number,string>[];

    // Test Multiple Choice one Test per Level
    MCTest: Helper<string, string[]>[];

    // Array of Tasks to Model


    constructor(levid: number, name: string, page: number[], desc: string[], mctest: Helper<string, string[]>[]) {
        this.levelID = levid;
        this.name = name;
        this.PageDesc = new Array;
        this.MCTest = new Array;
        this.MCTest = mctest;

        for (let n of page) {
            this.PageDesc.push(new Helper(n, desc[n-1]));
        }


        
    }
}

