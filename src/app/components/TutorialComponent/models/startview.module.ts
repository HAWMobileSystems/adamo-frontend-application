export class Startview {
  constructor(name) {
    this.catName = name;
    this.tasks = [];
  }
  catName: string;
  catIdentifier: number;
  intro_status: boolean;
  mult_qs_cor: number;
  mult_qs_all: number;
  tasks: ModellingTask[];
}

export class ModellingTask {
  constructor(id, name, score, identifier) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.identifier = identifier;
  }
  id: string;
  identifier: number;
  name: string;
  score: number;
}
