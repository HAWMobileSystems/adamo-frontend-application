import {Component, Input} from '@angular/core';
import {Variable} from './variable';
@Component({
    selector: 'inputvar-comp',
    template: `
    <span>
      {{varName.name}}: <input type="text" [(ngModel)]="varName.value">
    </span>
    <br/>
	  `
})
export class InputVarComponent {
  @Input() public varName : Variable;
}