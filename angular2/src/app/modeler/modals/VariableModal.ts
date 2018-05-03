import { AbstractCustomModal } from './AbstractCustomModal';
import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Variable } from './variables.component';

@Component({
    selector: 'variable-modal',
    template: `
    <modal [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="closed()" (onDismiss)="dismissed()"
    (onOpen)="opened()" [cssClass]="cssClass" #modal  >
      <modal-header [show-close]="true">
        <h2>IPIM Variables</h2>
      </modal-header>
      <modal-body>
        <p>Please specify the variables used:</p>
            <form>
            <!-- Fieldset, later on the inputs are dynamicaly created see script part-->
                <fieldset id="variablefset" *ngFor="let variable of variables">
                    {{ variable.name }}
                </fieldset>  
                
            </form>
      </modal-body>
      <modal-footer [show-default-buttons]="false">
         <button type="button" class="btn btn-large btn-block btn-default" (click)="insertVariables()">Add Variable</button>
         <!-- <input type="button" value=" Add Variable " id="IPIMButtonAddVariable" (click) = "insertVariableField()"> -->
         <input type="button" value=" Set " id="VariableModalButton">
      </modal-footer>
    </modal>
    `
  })

export class VariableModal extends ModalComponent {
    private IPIM_VAL : string = 'IPIM_Val';
    private IPIM_META : string = 'IPIM_Meta';

    //private variables: Variable[];

    private variables = [
        new Variable(1, 'Windstorm'),
        new Variable(13, 'Bombasto'),
        new Variable(15, 'Magneta'),
        new Variable(20, 'Tornado')
      ];


    private modeler : any;
    public termList: any;
  /*   constructor() {
        super();
        console.log('VariableModal constructor');
        this.fillModal();

    } */

    @ViewChild('modal')
    public modal: ModalComponent;
    public selected: string;
    public output: string;
    public index: number = 0;
    public cssClass: string = '';

    public  animation: boolean = true;
    public  keyboard: boolean = true;
    public backdrop: string | boolean = true;
    public css: boolean = false;

    public setProps(modeler: any, termList: any) {
        this.termList = termList;
        this.modeler = modeler;
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
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
                //Prüfen ob der Name des Elementes IPIM_Val entspricht
                const extrasValues = extras[0].values[i];
                const extrasValueNameLowerCase = extrasValues.name.toLowerCase();
                const startsWithIpimVal: boolean = extrasValueNameLowerCase.startsWith(this.IPIM_VAL + '_'.toLowerCase());
                const startsWithIpimMeta: boolean = extrasValueNameLowerCase.startsWith(this.IPIM_META + '_'.toLowerCase());

                if (startsWithIpimVal) {
                    this.insertVariableField(
                        extrasValues.name.toLowerCase().replace('IPIM_Val_'.toLowerCase(), ''),
                        extrasValues.value.toLowerCase(), 'variablefset', false);
                }

                if (startsWithIpimMeta) {
                    this.insertVariableField(
                        extrasValues.name.toLowerCase().replace('IPIM_META_'.toLowerCase(), ''),
                        extrasValues.value.toLowerCase(), 'variablefset', true);
                }
            }
        }
    }
    public cancel(): void {
        console.log('VariableModal cancel');
        this.clearModal('variablefset');
        this.dismiss();
    }

    public clearModal(s: string){
        //Bereich zum Löschen per getElement abfragen
        var inpNode = document.getElementById(s);
        //Solange es noch ein firstChild gibt, wird dieses entfernt!
        while (inpNode.firstChild) {
          inpNode.removeChild(inpNode.firstChild);
        }
    }

    public accept(): void {
        console.log('VariableModal accept');
        this.writeVariableModalValues();
    }

    public insertVariables(): void{
        console.log('insertVariables');
        this.insertVariableField('newField','NewVariable','variablefset', false);
    }

    // TODO: FIxme in a template?
    private insertVariableField = (pname: string, inpval: string, pform: string, meta: boolean) => {
        console.log('Variablemodal insertVariableField clicked');
        debugger;
        const inputField = document.createElement('input');
        inputField.setAttribute('type', 'text');
        inputField.setAttribute('name', 'textbox');
        inputField.setAttribute('value', pname);
        inputField.setAttribute('id', 'Variable_IPIM_Val_'.toLowerCase() + pname.toLowerCase());

        const valueField = document.createElement('input');
        valueField.setAttribute('type', 'text');
        valueField.setAttribute('name', 'valuebox');
        valueField.setAttribute('value', inpval);
        valueField.setAttribute('class', 'maxwid');
        valueField.setAttribute('id', 'Variable_IPIM_Val_'.toLowerCase() + pname.toLowerCase());

        // (<HTMLElement> checkingBox).attr({"data-test-1":'num1', "data-test-2": 'num2'});
        // $('#pform').append('<input>').attr({});

        const checkingbox = document.createElement('input');
        // checkingbox.attributes;
        checkingbox.setAttribute('type', 'checkbox');
        checkingbox.setAttribute('name', 'checkbox');
        checkingbox.setAttribute('value', 'Meta?');
        if (meta) {
            checkingbox.setAttribute('checked', meta.toString());
        }
        checkingbox.setAttribute('id', 'Variable_IPIM_'.toLowerCase() + pname.toLowerCase());

        const br = document.createElement('br');

        const node = document.createTextNode('Variable:     ');

        const field = document.getElementById(pform);

        field.appendChild(node);
        field.appendChild(inputField);
        field.appendChild(document.createTextNode('    Meta?:'));
        field.appendChild(checkingbox);
        field.appendChild(document.createElement('br'));
        field.appendChild(document.createTextNode('    Default:'));
        field.appendChild(valueField);
        //document.getElementById(pform).appendChild(br);
        field.appendChild(br);
        field.appendChild(document.createElement('hr'));

    }

    private fillVariableModal() {
        //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
        const elementRegistry = this.modeler.get('elementRegistry');
        const modeling = this.modeler.get('modeling');
        //Alle Elemente der ElementRegistry holen
        const elements = elementRegistry.getAll();
        const element = elements[0];
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (typeof element.businessObject.extensionElements !== 'undefined') {
            //Wenn vorhandne die Elemente auslesen
            const extras = element.businessObject.extensionElements.get('values');
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
                //Prüfen ob der Name des Elementes IPIM_Val entspricht
                const extrasValues = extras[0].values[i];
                const extrasValueNameLowerCase = extrasValues.name.toLowerCase();
                const ipimVal: boolean = extrasValueNameLowerCase.startsWith(this.IPIM_VAL + '_'.toLowerCase());
                const ipimMeta: boolean = extrasValueNameLowerCase.startsWith(this.IPIM_META + '_'.toLowerCase());

                if (ipimVal) {
                    this.insertVariableField(
                        extrasValues.name.toLowerCase().replace('IPIM_Val_'.toLowerCase(), ''),
                        extrasValues.value.toLowerCase(),
                        'variablefset',
                        false);
                }

                if (ipimMeta) {
                    this.insertVariableField(
                        extrasValues.name.toLowerCase().replace('IPIM_META_'.toLowerCase(), ''),
                        extrasValues.value.toLowerCase(),
                        'variablefset',
                        true);
                }
            }
        }
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
        const fields = document.getElementsByName('textbox');
        const checkboxes = document.getElementsByName('checkbox');
        const valueboxes = document.getElementsByName('valuebox');
        for (let fieldi = 0; fieldi < fields.length; fieldi++) {
            if ((<HTMLInputElement>fields[fieldi]).value !== '') {
                extras[0].values.push(moddle.create('camunda:Property'));
                (<HTMLInputElement>checkboxes[fieldi]).checked
                    ? extras[0].values[fieldi].name = this.IPIM_META + '_' + (<HTMLInputElement>fields[fieldi]).value.trim()
                    : extras[0].values[fieldi].name = this.IPIM_VAL + + '_' + (<HTMLInputElement>fields[fieldi]).value.trim();

                (<HTMLInputElement>valueboxes[fieldi]).value !== ''
                    ? extras[0].values[fieldi].value = (<HTMLInputElement>valueboxes[fieldi]).value.trim()
                    : extras[0].values[fieldi].value = ' ';
            }
        }
    }
}