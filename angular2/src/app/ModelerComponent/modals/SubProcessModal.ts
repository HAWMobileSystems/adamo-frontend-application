import { AbstractCustomModal } from './AbstractCustomModal';
import { Component, Input , ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'subprocess-modal',
  template: `
  <modal [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="closed()" (onDismiss)="dismissed()"
  (onOpen)="opened()" [cssClass]="cssClass" #modal  >
    <modal-header [show-close]="true">
      <h2>IPIM SubProcess</h2>
    </modal-header>
    <modal-body>
      <p>Please define a new subprocess ID for all selected Subprocesses:</p>
        <input type="text" [(ngModel)]="firstSubprocess">
        <br>
      <br>
    </modal-body>
    <modal-footer [show-default-buttons]="false">
        <button type="button" class="btn btn-large btn-block btn-default" (click)="writeSubProcessModalValues()">Set SubProcess</button>
        <!-- <input type="button" value=" Set Term " id="SetTermModal"> -->
    </modal-footer>
  </modal>
  `
})

export class SubProcessModal extends ModalComponent {
  //@Input()
  //@ViewChild('termModalModalComponent') private modal: ModalComponent;
  public modeler: any;
  // private IPIM_VAL : string = 'IPIM_Val';
  // private IPIM_META : string = 'IPIM_Meta';
  //@Input()
  public subProcessList: any;
  public firstSubprocess: any;

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

  public setProps(modeler: any, subProcessList: any) {
    this.subProcessList = subProcessList;
    this.modeler = modeler;
    if (subProcessList.length > 0) {this.firstSubprocess = subProcessList[0]; } else {this.firstSubprocess = ' '; }
  }

  /* constructor(modeler: any, termList: any) {
    super(modeler);
    console.log(this.constructor.name + ' Constructor');
    this.termList = termList;

    // this.fillModal(termList);
  } */

  private opened() {
    console.log('SubProcessModal Opended');
  }

  protected fillModal(): void {
    console.log(this.constructor.name + ' fillModal');
  }

  private dismissed() {
    console.log('SubProcessModal dismissed');
  }

  private closed() {
    console.log('SubProcessModal closed');
  }

  public cancel(): void {
    this.dismiss();
  }

  private  fillSubProcessModal() {

    const terms = this.subProcessList;

    if (terms.length > 1) {window.alert('Attention! Selected Elements already have different SubProcesses!'); }

  }

  public accept() {
    console.log(this.constructor.name + ' fillModal');
    if (this.fillSubProcessModal.length > 1) {
      window.alert('Attention selected Elements already have different Subprocesses!');
    }
    const element = <HTMLInputElement>document.getElementById('inputFieldSubprocess');
    !element
      ? console.error('no such element')
      : (this.subProcessList.length > 0)
        ? element.value = this.subProcessList[0]
        : element.value = '';
  }

  private writeSubProcessModalValues() {
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
        let found = false;
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM_Calc entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith('IPIM_SubProcess'.toLowerCase())) {
            if (this.firstSubprocess !== '') {
              extras[0].values[i].value = this.firstSubprocess.trim();
            } else {
              extras[0].values.splice(i, 1);
            }
            found = true;
            break;
          }
        }

        if (!found) {
          extras[0].values.push(moddle.create('camunda:Property'));
          extras[0].values[extras[0].values.length - 1].name = 'IPIM_SubProcess';
          extras[0].values[extras[0].values.length - 1].value = this.firstSubprocess.trim();
        }

      } else {
        if (this.firstSubprocess !== '') {
          element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
          const extras = element.businessObject.extensionElements.get('values');
          extras.push(moddle.create('camunda:Properties'));
          extras[0].values = [];
          extras[0].values.push(moddle.create('camunda:Property'));
          extras[0].values[0].name = 'IPIM_SubProcess';
          extras[0].values[0].value = this.firstSubprocess.trim();
        }
      }
    });
    this.modal.close();
  }
}

/**
 *
  <modal>
    <modal-header>
        <h4 class="modal-title">TermModal!</h4>
    </modal-header>
    <modal-body>
        <div class="form-group">
            <label for="term">Insert new Term for all Elements</label>
            <textarea value="" id="inputFieldTerm" class="maxwid"></textarea>
        </div>
    </modal-body>
    <modal-footer>
        <button type="button" class="btn btn-default" data-dismiss="this" (click)="this.dismiss()">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="this.accept()">Ok</button>
    </modal-footer>
</modal>
 */

/* <div id="TermModal" class="modal" display:block #TermMod>

  <!-- Modal content  Header-->
  <div class="modal-content">
    <div class="modal-header">
      <span class="close" id ="TermClose">&times;</span>
      <h2>IPIM Terms</h2>
    </div>
    <div class="modal-body">
      <p>Please insert new Term for all Elements:</p>
	  <form>

		<!-- <input type="text" value="" id="inputFieldTerm" style="min-width: 100%">  -->
		<textarea value="" id="inputFieldTerm" class="maxwid">
		</textarea>
		<br>

	  </form>
	  <br>
    </div>
    <div class="modal-footer">
      <input type="button" value=" Set Term " id="SetTermModal">
    </div>
  </div>

</div> */
