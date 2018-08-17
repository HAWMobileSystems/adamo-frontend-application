import {ModelerComponent} from '../ModelerComponent/modeler.component';

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
    private _xml: string;
    private _name: string;
    private _id: number;
    private _modelerComponent: ModelerComponent;
    private _version: string;

    constructor(){}
}
