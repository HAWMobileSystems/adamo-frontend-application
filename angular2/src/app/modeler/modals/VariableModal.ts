import { AbstractCustomModal } from './AbstractCustomModal';
import { Component, Input } from '@angular/core';

export class VariableModal extends AbstractCustomModal {

    @Input() private modeler : any;
  /*   constructor() {
        super();
        console.log('VariableModal constructor');
        this.fillModal();

    } */

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

    public accept(): void {
        console.log('VariableModal accept');
        this.writeVariableModalValues();
    }

    // TODO: FIxme in a template?
    private insertVariableField = (pname: string, inpval: string, pform: string, meta: boolean) => {
        console.log('Variablemodal insertVariableField');
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

        document.getElementById(pform).appendChild(node);
        document.getElementById(pform).appendChild(inputField);
        document.getElementById(pform).appendChild(document.createTextNode('    Meta?:'));
        document.getElementById(pform).appendChild(checkingbox);
        document.getElementById(pform).appendChild(document.createElement('br'));
        document.getElementById(pform).appendChild(document.createTextNode('    Default:'));
        document.getElementById(pform).appendChild(valueField);
        //document.getElementById(pform).appendChild(br);
        document.getElementById(pform).appendChild(br);
        document.getElementById(pform).appendChild(document.createElement('hr'));
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