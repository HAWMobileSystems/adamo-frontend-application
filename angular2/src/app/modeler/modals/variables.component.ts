import {Component, Input} from '@angular/core';
import {Variable} from './variable';
@Component({
    selector: 'variable-comp',
    template: `
    <span>
      Variable: <input type="text" [(ngModel)]="varName.name"> <input type="checkbox" value="Meta?" [(ngModel)]="varName.meta"> Meta?
    </span>
    <br>
    <span> Value:  <input type="text" [(ngModel)]="varName.value"> </span>
	  `
})
export class VariableComponent {
  @Input() public varName : Variable;
}