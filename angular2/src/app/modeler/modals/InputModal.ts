import { AbstractCustomModal } from './AbstractCustomModal';
import { Component, Input } from '@angular/core';

export class InputModal extends AbstractCustomModal {
    // private IPIM_VAL : string = 'IPIM_Val';
    // private IPIM_META : string = 'IPIM_Meta';

    @Input() private modeler : any;
    /* constructor(modeler: any) {
        super(modeler);
        console.log('InputModal Constructor');
        this.fillModal();
    } */

    public cancel() : void {
        this.clearModal('inputfset');
        this.dismiss();
    }

    public accept(): void {
        this.writeInputModalValues();
    }

  private writeInputModalValues() {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    //Alle Elemente durchlaufen um Variablen zu finden
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM_Val entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith('IPIM_Val_'.toLowerCase())) {
            const inpelement = 'Input_' + extras[0].values[i].name;
            //Variablen aus Inputfeld zurückschreiben
            extras[0].values[i].value = (<HTMLInputElement>document.getElementById(inpelement.toLowerCase())).value;
          }
        }
      }
    });
  }

  public fillModal() {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.businessObject.extensionElements) {
        const extras = element.businessObject.extensionElements.get('values'); //'values');
        extras[0].values.map((extra: any, index: number) => {
          if (extras[0].values[index].name.toLowerCase().startsWith(this.IPIM_VAL.toLowerCase() + '_')) {
            this.insertInputField(
              extras[0].values[index].name.toLowerCase().replace(this.IPIM_VAL.toLowerCase()  + '_', ''),
              extras[0].values[index].value.toLowerCase(), 'inputfset');
          }
        }
        );
      }
    }
  }

   private insertInputField(pname: string, inpval: string, pform: string) {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('name', pname);
    inputField.setAttribute('value', inpval);
    inputField.setAttribute('id', 'Input_IPIM_Val_'.toLowerCase() + pname.toLowerCase());
    const br = document.createElement('br');

    const node = document.createTextNode('Variable ' + pname + ':     ');

    document.getElementById(pform).appendChild(node);
    document.getElementById(pform).appendChild(document.createElement('br'));
    document.getElementById(pform).appendChild(inputField);
    //document.getElementById(pform).appendChild(br);
    document.getElementById(pform).appendChild(br);

  }
}