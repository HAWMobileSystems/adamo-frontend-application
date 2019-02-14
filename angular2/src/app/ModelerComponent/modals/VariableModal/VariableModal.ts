// import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { VariableComponent } from '../VariablesComponent/variables.component';
import { Variable } from '../variable';

@Component({
    selector: 'variable-modal',
    templateUrl: './VariableModal.html'
  })

export class VariableModal extends BsModalComponent {
    private IPIM_VAL : string = 'IPIM_Val';
    private IPIM_META : string = 'IPIM_Meta';

    //private variables: Variable[];

    public variables: Variable[] = [
        // new Variable('prepacked', 'yes', true),
        // new Variable('bookonwithdrawal', 'yes', true),
        // new Variable('noOperation', 'no', false)
      ];

    private modeler : any;
    public termList: any;
    public root: any;
  /*   constructor() {
        super();
        console.log('VariableModal constructor');
        this.fillModal();

    } */

    @ViewChild('modal')
    public modal: BsModalComponent;
    public selected: string;
    public output: string;
    public index: number = 0;
    public cssClass: string = '';

    public  animation: boolean = true;
    public  keyboard: boolean = true;
    public backdrop: string | boolean = true;
    public css: boolean = false;

    public opened() {
        console.log('opened Variable Modal');
        this.variables = [];
        this.fillModal();
    }

    public setProps(modeler: any, root: any) {
        console.log('Variable Modal Set Props');
        this.root = root;
        this.modeler = modeler;
    }

    public addNewVar(): void {
        this.addVar('newVariable', 'newValue', false);
    }

    public addVar(name: string, value: string, meta: boolean): void {
        this.variables.push(new Variable(name, value, meta));
    }

    public fillModal(): void {
        console.log('VariableModal fillModal');
        //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
        const elementRegistry = this.modeler.get('elementRegistry');
        const modeling = this.modeler.get('modeling');
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

    private dismissed() {
        console.log('VariableModal dismissed');
    }

    private closed() {
        console.log('VariableModal closed');
    }

    private writeVariableModalValues() {
        //get moddle Object
        const elementRegistry = this.modeler.get('elementRegistry');
        const moddle = this.modeler.get('moddle');

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
        for (let fieldi = 0; fieldi < this.variables.length; fieldi++) {
            if ((this.variables[fieldi]).value !== '') {
                extras[0].values.push(moddle.create('camunda:Property'));
                this.variables[fieldi].meta
                    ? extras[0].values[fieldi].name = this.IPIM_META + '_' + (this.variables[fieldi]).name.trim()
                    : extras[0].values[fieldi].name = this.IPIM_VAL + '_' + (this.variables[fieldi]).name.trim();

                this.variables[fieldi].value !== ''
                    ? extras[0].values[fieldi].value = (this.variables[fieldi]).value.trim()
                    : extras[0].values[fieldi].value = ' ';
            }
        }
        //Publish Changes to other subscribers!
        this.root.getCommandStack().publishXML();
        //finished so close this modal!
        this.modal.close();
    }
}