import { AbstractCustomModal } from './AbstractCustomModal';
import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'input-modal',
  template: `
  <modal [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="closed()" (onDismiss)="dismissed()"
  (onOpen)="opened()" [cssClass]="cssClass" #modal  >
    <modal-header [show-close]="true">
      <h2>IPIM Evaluation</h2>
    </modal-header>
    <modal-body>
      <p>Please specify the values used:</p>
      <form>
        <!-- Fieldset, later on the inputs are dynamicaly created see script part-->
        <fieldset id="inputfset">
        </fieldset>
      </form>
    </modal-body>
    <modal-footer [show-default-buttons]="false">
      <input type="button" value=" Evaluate " id="EvalModal">
    </modal-footer>
  </modal>
  `
})

export class InputModal extends ModalComponent {
  private IPIM_VAL : string = 'IPIM_Val';
  private IPIM_META : string = 'IPIM_Meta';

  private modeler : any;
  public termList: any;
  /* constructor(modeler: any) {
      super(modeler);
      console.log('InputModal Constructor');
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

  public cancel() : void {
      this.clearModal('inputfset');
      this.dismiss();
  }

  public accept(): void {
      this.writeInputModalValues();
  }

  public clearModal(s: string){
    //Bereich zum Löschen per getElement abfragen
    var inpNode = document.getElementById(s);
    //Solange es noch ein firstChild gibt, wird dieses entfernt!
    while (inpNode.firstChild) {
      inpNode.removeChild(inpNode.firstChild);
    }
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