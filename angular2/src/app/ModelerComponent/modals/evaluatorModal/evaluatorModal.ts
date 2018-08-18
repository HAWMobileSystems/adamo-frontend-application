import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { Variable } from '../variable';
import { InputVarComponent } from '../input.component';

@Component({
  selector: 'eval-modal',
  templateUrl: './evaluatorModal.html'
})

export class EvalModal extends ModalComponent {
  private IPIM_VAL : string = 'IPIM_Val';
  private IPIM_META : string = 'IPIM_Meta';

  private modeler : any;
  private root : any;
  /* constructor(modeler: any) {
      super(modeler);
      console.log('InputModal Constructor');
      this.fillModal();
  } */

  public variables: Variable[] = [];

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

  public setProps(modeler: any, root: any) {
    this.modeler = modeler;
    this.variables = [];
    this.root = root;
  }

  public cancel() : void {
      this.clearModal('evalfset');
      this.dismiss();
  }

  public accept(): void {
      this.writeInputModalValues();
  }

  private opened() {
    console.log('EvaluatorModal opened');
  }

  private dismissed() {
    console.log('EvaluatorModal dismissed');
  }

  private closed() {
    console.log('EvaluatorModal closed');
  }

  public clearModal(s: string) {
    //Bereich zum Löschen per getElement abfragen
    const inpNode = document.getElementById(s);
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
            let inpelement = 'Error Variable not found';

            for (let u = 0; u < this.variables.length; u++) {
              if (('IPIM_Val_' + this.variables[u].name).toLowerCase() === extras[0].values[i].name.toLowerCase()) {
                inpelement = this.variables[u].value;
                break;
              }
            }

            //Variablen aus Inputfeld zurückschreiben
            extras[0].values[i].value = inpelement;
          }
        }
      }
    });
    this.root.evaluateProcess();
    this.modal.close();
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
            this.addVar(
              extras[0].values[index].name.toLowerCase().replace(this.IPIM_VAL.toLowerCase()  + '_', ''),
              extras[0].values[index].value.toLowerCase(), false);
          }
        }
        );
      }
    }
  }

  public addVar(name: string, value: string, meta: boolean): void {
    this.variables.push(new Variable(name, value, meta));
  }

}