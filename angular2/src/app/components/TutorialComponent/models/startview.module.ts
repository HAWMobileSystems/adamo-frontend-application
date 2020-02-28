export class Startview {
    constructor(name){
        this.catName = name
        this.tasks = new Array
    }
    catName: String
    intro_status: boolean
    mult_qs_cor: number
    mult_qs_all: number
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