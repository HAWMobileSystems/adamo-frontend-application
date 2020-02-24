// answer: "Answer 1 English-Wrong"
// answerID: "12a14b17-e7b2-4d64-8786-a4508f0115e2"​
// id: "577e9586-ebd3-4137-93f6-7e21cb31cd8e"
// ​question: "First Real MC Question"

export class MultipleChoiceQuest {
    id:any
    question: any
    answers: KeyValuePair[]

    constructor(id,quest){
        this.id = id
        this.question = quest
        this.answers = new Array
    }
}

export interface KeyValuePair {
    key: String;
    value: String;
}