import {Pipe, PipeTransform} from '@angular/core';

const bigInt = require('big-integer');

@Pipe({
  name: 'version',
  pure: false
})

/*Version of model when updating this or previous version
  - Changing a model increments version number (example 1=>2)
  - Changing sub-version of a model increments sub-version number (example 1.1=>1.2)
  - Changing older version of model with no existing sub-version creates sub-version (example 1=>1.1)
  - Maximum version number level is four
  - Maximum version with maximum level equals 65535.65535.65535.65535
*/
export class Version implements PipeTransform {

  public transform(value: any, args?: any): any {
    //Version number level 1: Does version + 2^48 already exist?
    const vers1 = bigInt(value).shiftRight(48);
    //Version number level 2: Does version + 2^32 already exist?
    const vers2 = bigInt(value).and(bigInt('0000FFFF00000000', 16)).shiftRight(32);
    //Version number level 3: Does version + 2^16 already exist?
    const vers3 = bigInt(value).and(bigInt('00000000FFFF0000', 16)).shiftRight(16);
    //Version number level 4: Does version + 1 already exist?
    const vers4 = bigInt(value).and(bigInt('000000000000FFFF', 16));
    let version = '';
    if (!bigInt(vers4).isZero()) {
      version = vers1 + '.' + vers2 + '.' + vers3 + '.' + vers4 + version;
    } else if (!bigInt(vers3).isZero()) {
      version = vers1 + '.' + vers2 + '.' + vers3;
    } else if (!bigInt(vers2).isZero()) {
      version = vers1 + '.' + vers2;
    } else if (!bigInt(vers1).isZero()) {
      version = vers1;
    }
    return version;
  }
}