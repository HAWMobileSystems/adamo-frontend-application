// import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input, ViewChild, Host, Inject } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { VariableComponent } from '../VariablesComponent/variables.component';
import { Variable } from '../variable';
import { ModelerComponent } from '../../modeler.component';

import {FormBuilder, Validators, FormGroup} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
@Component({
    selector: 'variable-modal',
    templateUrl: './VariableModal.html'
  })

export class VariableModal {
    get variables(): Variable[] {
        return this._variables;
    }
    private IPIM_VAL : string = "IPIM_Val";
    private IPIM_META : string = "IPIM_Meta";

    private _variables: Variable[];


    private data: any;
    public termList: any;

    constructor(
        // @Host() parent: ModelerComponent,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data: any,
      private dialogRef: MatDialogRef<VariableModal>) {
        this._variables = [];
        this.data = data
        this.fillModal();
    } 

    // @ViewChild('modal')
    // public modal: BsModalComponent;
    public selected: string;
    public output: string;
    public index: number = 0;
    // public cssClass: string = '';

    // public  animation: boolean = true;
    // public  keyboard: boolean = true;
    // public backdrop: string | boolean = true;
    // public css: boolean = false;

    public opened() {
        console.log('opened Variable Modal');
        this._variables = [];
        this.fillModal();
    }

    // public setProps(modeler: any, root: any) {
    //     console.log('Variable Modal Set Props');
    //     this.root = root;
    //     this.modeler = modeler;
    // }

    public addNewVar(): void {
        this.addVar('newVariable', 'newValue', false);
    }

    public addVar(name: string, value: string, meta: boolean): void {
        this._variables.push(new Variable(name, value, meta));
    }

    public fillModal(): void {
        console.log('VariableModal fillModal');
        //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
        const elementRegistry = this.data.modeler.get('elementRegistry');
        const modeling = this.data.modeler.get('modeling');
        //Alle Elemente der ElementRegistry holen
        const elements = elementRegistry.getAll();
        const element = elements[0];
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
            //Wenn vorhandne die Elemente auslesen
            const extras = element.businessObject.extensionElements.get('values');
            if (extras[0].values) {
                //Schleife über alle Elemente
                for (let i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM_Val entspricht
                    const extrasValues = extras[0].values[i];
                    const extrasValueNameLowerCase = extrasValues.name.toLowerCase();
                    const startsWithIpimVal: boolean = extrasValueNameLowerCase.startsWith((this.IPIM_VAL + '_').toLowerCase());
                    const startsWithIpimMeta: boolean = extrasValueNameLowerCase.startsWith((this.IPIM_META + '_').toLowerCase());

                    if (startsWithIpimVal) {
                        this.addVar(
                            extrasValues.name.toLowerCase().replace('IPIM_Val_'.toLowerCase(), ''),
                            extrasValues.value.toLowerCase(), false);
                    }

                    if (startsWithIpimMeta) {
                        this.addVar(
                            extrasValues.name.toLowerCase().replace('IPIM_META_'.toLowerCase(), ''),
                            extrasValues.value.toLowerCase(), true);
                    }
                }
            }
        }
    }
    public cancel(): void {
        console.log('VariableModal cancel');
        this.dismiss();
    }

    public accept(): void {
        console.log('VariableModal accept');
        this.writeVariableModalValues();
    }

    public dismiss() {
        console.log('VariableModal dismissed');
    }

    public close() {
        console.log('VariableModal closed');
    }

    public writeVariableModalValues() {
        //get moddle Object
        const elementRegistry = this.data.modeler.get('elementRegistry');
        const moddle = this.data.modeler.get('moddle');

        //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
        const elements = elementRegistry.getAll();
        const element = elements[0];
        //reset camunda extension properties
        element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
        const extras = element.businessObject.extensionElements.get('values');
        extras.push(moddle.create('camunda:Properties'));
        extras[0].values = [];

        //Alle Elemente des Eingabefeldes durchlaufen um Variablen zu finden und dem Root Element hinzuzufügen
        //const fieldset= document.getElementById('variablefset');
        for (let fieldi = 0; fieldi < this._variables.length; fieldi++) {
            if ((this._variables[fieldi]).value !== '') {
                extras[0].values.push(moddle.create('camunda:Property'));
                this._variables[fieldi].meta
                    ? extras[0].values[fieldi].name = this.IPIM_META + '_' + (this._variables[fieldi]).name.trim()
                    : extras[0].values[fieldi].name = this.IPIM_VAL + '_' + (this._variables[fieldi]).name.trim();

                this._variables[fieldi].value !== ''
                    ? extras[0].values[fieldi].value = (this._variables[fieldi]).value.trim()
                    : extras[0].values[fieldi].value = ' ';
            }
        }
        //Publish Changes to other subscribers!
        // this.root.getCommandStack().publishXML();
        //finished so close this modal!
        // this.modal.close();
        this.dialogRef.close(true);
    }
}