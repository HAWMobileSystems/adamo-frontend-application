import {Component, Input} from '@angular/core';
import {Variable} from '../variable';
@Component({
    selector: 'variable-comp',
    templateUrl: './variables.component.html'
})
export class VariableComponent {
  @Input() public varName : Variable;
}