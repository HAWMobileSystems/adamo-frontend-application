export class Startview {
    constructor(name){
        this.catName = name
        this.tasks = new Array
    }
    catName: String
    intro_status: boolean
    mult_qs_res: any
    tasks: ModellingTask[]
}

export class ModellingTask {

    constructor(id, name, score){
        this.id = id
        this.name = name
        this.score = score
    }
    id: String
    name: String
    score: Number
}