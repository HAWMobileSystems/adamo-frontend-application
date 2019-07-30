import { ModelerComponent } from "../ModelerComponent/modeler.component";

export class Model {
  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  get modelerComponent(): ModelerComponent {
    return this._modelerComponent;
  }

  set modelerComponent(value: ModelerComponent) {
    this._modelerComponent = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get xml(): string {
    return this._xml;
  }

  set xml(value: string) {
    this._xml = value;
  }

  get collaborator(): string[] {
    return this._collaborator;
  }

  set collaborator(value: string[]) {
    this._collaborator = value;
  }

  get showInfo(): boolean {
    return this._showInfo;
  }

  set showInfo(value: boolean) {
    this._showInfo = value;
  }

  get read(): boolean {
    return this._read;
  }

  set read(value: boolean) {
    this._read = value;
  }

  get write(): boolean {
    return this._write;
  }

  set write(value: boolean) {
    this._write = value;
  }

  private _xml: string;
  private _name: string;
  private _id: number;
  private _modelerComponent: ModelerComponent;
  private _version: string;
  private _collaborator: string[];
  private _showInfo: boolean;
  private _read: boolean;
  private _write: boolean;

  // constructor() {}

  constructor(model: any) {
    model.xml = model.modelxml;
    model.name = model.modelname;
    model.id = model.mid;
    model.version = model.version || null;
    model.read = model.read || null;
    model.write = model.write|| null;
    model.collaborator = [];
  }

}
