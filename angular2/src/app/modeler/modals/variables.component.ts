import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'variableEntry',
  template: `
  <div>
    <p>Variable: </p>
  </div>
    `
})

export class Variable {

    constructor(
      public id: number,
      public name: string) { }

  }