import {Pipe, PipeTransform} from '@angular/core';

const bigInt = require('big-integer');

@Pipe({
  name: 'version',
  pure: false
})
export class Version implements PipeTransform {

  public transform(value: any, args?: any): any {
    const vers1 = bigInt(value).shiftRight(48);
    const vers2 = bigInt(value).and(bigInt('0000FFFF00000000', 16)).shiftRight(32);
    const vers3 = bigInt(value).and(bigInt('00000000FFFF0000', 16)).shiftRight(16);
    const vers4 = bigInt(value).and(bigInt('000000000000FFFF', 16));
    let version = '';
    if (!bigInt(vers4).isZero()) {
      version = vers1 + '.' + vers2 + '.' + vers3 + '.' + vers4 + version;
    } else if (!bigInt(vers3).isZero()) {
      version = vers1 + '.' + vers2 + '.' + vers3;
    } else if (!bigInt(vers2).isZero()) {
      version = vers1 + '.' + vers2;
    } else if (!bigInt(vers1).isZero()) {version = vers1;}
    return version;
  }

}