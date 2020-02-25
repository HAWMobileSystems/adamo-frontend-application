'use strict'

export enum Language {
  en = 'en',
  de = 'de'
}

export namespace Language {

  export function values() {
    return Object.keys(Language).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}

