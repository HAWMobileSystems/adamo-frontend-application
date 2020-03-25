import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterUnique',
  pure: false
})
export class FilterUnique implements PipeTransform {
  public transform(value: Object[], args?: any): any {
    const propertyToBeFiltered = args[0];
    if (args[1]) {
      return value;
    }
    const mySet = new Set();
    return value.filter(x => {
      if (args[2]) {
        if (args[2][propertyToBeFiltered] === x[propertyToBeFiltered]) {
          return true;
        }
      }
      const isNew = !mySet.has(x[propertyToBeFiltered]);
      if (isNew) {
        mySet.add(x[propertyToBeFiltered]);
      }
      return isNew;
    });
  }
}