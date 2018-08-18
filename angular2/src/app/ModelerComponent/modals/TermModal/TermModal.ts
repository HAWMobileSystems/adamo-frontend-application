import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input , ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'term-modal',
  templateUrl: './TermModal.html'
})

export class TermModal extends ModalComponent {
  public modeler: any;
  public termList: any;
  public firstTerm: any;

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
    if (termList.length > 0) {this.firstTerm = termList[0]; } else {this.firstTerm = ' '; }
  }

  private opened() {
    console.log('TermModal Opended');
    this.fillTermModal();
  }

  protected fillModal(): void {
    console.log(this.constructor.name + ' fillModal');
  }

  private dismissed() {
    console.log('TermModal dismissed');
  }

  private closed() {
    console.log('TermModal closed');
  }

  public cancel(): void {
    this.dismiss();
  }

  private  fillTermModal() {

    const terms = this.termList;

    if (terms.length > 1) {window.alert('Attention! Selected Elements already have different Terms!'); }

  }

  public accept() {
    console.log(this.constructor.name + ' fillModal');
    if (this.termList.length > 1) {
      window.alert('Attention selected Elements already have different Terms!');
    }
    const element = <HTMLInputElement>document.getElementById('inputFieldTerm');
    !element
      ? console.error('no such element')
      : (this.termList.length > 0)
      ? element.value = this.termList[0]
      : element.value = '';
  }

  private writeTermModalValues() {
    //get moddle Object
    const moddle = this.modeler.get('moddle');
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elements = this.modeler.get('selection').get();
    //Alle Elemente durchlaufen um Variablen zu finden
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM_Calc entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith('IPIM_Calc'.toLowerCase())) {
            if (this.firstTerm !== '') {
              extras[0].values[i].value = this.firstTerm;
            } else {
              extras[0].values.splice(i, 1);
            }
            break;
          }
        }
      } else {
        if (this.firstTerm !== '') {
          element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
          const extras = element.businessObject.extensionElements.get('values');
          extras.push(moddle.create('camunda:Properties'));
          extras[0].values = [];
          extras[0].values.push(moddle.create('camunda:Property'));
          extras[0].values[0].name = 'IPIM_Calc';
          extras[0].values[0].value = this.firstTerm;
        }
      }
    });
    this.modal.close();
  }
}