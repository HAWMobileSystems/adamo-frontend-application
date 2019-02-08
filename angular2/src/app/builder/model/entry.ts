import uuid from 'uuid';

export class Entry {
  public selected: boolean;
  private title: string;
  public uid : any;

  public setTitle(title: string) {
    this.title = title.trim();
  }

  constructor(title: string) {
    this.uid = uuid.v4();
    this.selected = false;
    this.title = title.trim();
  }
}
