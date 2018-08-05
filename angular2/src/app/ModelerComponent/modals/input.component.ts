import {Component, Input} from '@angular/core';
import {Variable} from './variable';
@Component({
    selector: 'inputvar-comp',
    template: `
    <form>
    <label> {{varName.name}}: </label>
    <br>
    <input type="text" [(ngModel)]="varName.value" class = "modal-form-input" [ngModelOptions]="{standalone: true}">
    <br>
  </form>

	  `
})
export class InputVarComponent {
  @Input() public varName : Variable;
}