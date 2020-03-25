import { ModelerComponent } from "../ModelerComponent/modeler.component";

export class Model {
  get version(): string {
    return this.version;
  }

  set version(value: string) {
    this.version = value;
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
    return this.name;
  }

  set name(value: string) {
    this.name = value;
  }

  get xml(): string {
    return this.xml;
  }

  set xml(value: string) {
    this.xml = value;
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

  get can_read(): boolean {
    return this._can_read;
  }

  set can_read(value: boolean) {
    this._can_read = value;
  }

  get can_write(): boolean {
    return this._can_write;
  }

  set can_write(value: boolean) {
    this._can_write = value;
  }

  private _model_xml: string;
  private _model_name: string;
  private _id: number;
  private _modelerComponent: ModelerComponent;
  private _model_version: string;
  private _collaborator: string[];
  private _showInfo: boolean;
  private _can_read: boolean;
  private _can_write: boolean;

  // constructor() {}

  constructor(model: any) {
    model.model_xml = model.model_xml;
    model.model_name = model.model_name;
    model.id = model.id;
    model.model_version = model.model_version || null;
    model.can_read = model.can_read || null;
    model.can_write = model.can_write|| null;
    model.collaborator = [];
  }

}
