import {Component, Input} from '@angular/core';
import {Variable} from './variable';
@Component({
    selector: 'variable-comp',
    template: `
    <div>
    <form>
      <div class = "modal-form-group">
        <label> Variable: </label>
        <br>
        <input type="text" [(ngModel)]="varName.name" class = "modal-form-input" [ngModelOptions]="{standalone: true}">
        <br>
        <label> Value: </label>
        <br>
        <input type="text" [(ngModel)]="varName.value" class = "modal-form-input" [ngModelOptions]="{standalone: true}">
        <br>
        <input type="checkbox" value="Meta?" [(ngModel)]="varName.meta" [ngModelOptions]="{standalone: true}"> Meta?
      </div>
    </form>
  </div>
	  `
})
export class VariableComponent {
  @Input() public varName : Variable;
}