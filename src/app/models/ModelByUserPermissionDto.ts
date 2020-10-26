import { ModelerComponent } from '../ModelerComponent/modeler.component';
import { IModelDto } from './interface/components/i-model-dto';
import { IModelPermissionDto } from './interface/components/i-model-permission-dto';

export class CollaborationModelEntity {
  get model_version(): number {
    return this._model_version;
  }

  set model_version(value: number) {
    this._model_version = value;
  }

  get modelerComponent(): ModelerComponent {
    return this._modelerComponent;
  }

  set modelerComponent(value: ModelerComponent) {
    this._modelerComponent = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  public get model_name(): string {
    return this._model_name;
  }

  public set model_name(value: string) {
    this._model_name = value;
  }

  public get model_xml(): string {
    return this._model_xml;
  }

  public set model_xml(value: string) {
    this._model_xml = value;
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
  private _id: string;
  private _modelerComponent: ModelerComponent;
  private _model_version: number;
  private _collaborator: string[];
  private _showInfo: boolean;
  private _can_read: boolean;
  private _can_write: boolean;

  // constructor() {}

  constructor(model: any) { // either ImodelPermisisonDTO | IModelDto
    this._model_xml = model.model_xml || model.modelXML;
    this._model_name = model.model_name || model.modelName;
    this._id = model.id;
    this._model_version = model.model_version || model.modelVersion ||null;
    this._can_read = model.can_read || null;
    this._can_write = model.can_write || null;
    this._collaborator = [];
  }
}
