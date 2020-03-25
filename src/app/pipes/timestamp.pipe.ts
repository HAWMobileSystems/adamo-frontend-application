import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timestamp2date',
  pure: false
})

/*  converts a postgress timestamp to local date time string*/
export class Timestamp2Date implements PipeTransform {

  public transform(value: any, args?: any): any {

    const date = new Date(value);

    const datestring = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();

    const timestring = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

    return datestring + ' ' + timestring;
  }
}