import {Component, Input} from '@angular/core';
import {Variable} from '../variable';
@Component({
    selector: 'inputvar-comp',
    templateUrl: './input.component.html'
})
export class InputVarComponent {
  @Input() public varName : Variable;
}