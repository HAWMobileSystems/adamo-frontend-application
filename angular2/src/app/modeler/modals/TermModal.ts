import { AbstractCustomModal } from './AbstractCustomModal';
import { Component, Input , ViewChild} from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'term-modal',
  template: `
  <modal [animation]="animation" [keyboard]="keyboard" [backdrop]="backdrop" (onClose)="closed()" (onDismiss)="dismissed()"
  (onOpen)="opened()" [cssClass]="cssClass" #modal  >
  <modal-header [show-close]="true">
      <h4 class="modal-title">I'm a popup!</h4>
  </modal-header>
  <modal-body>
      <ul>
          <li *ngFor="let item of items">
              <a href="#" (click)="$event.preventDefault(); selected = item">{{ item }}</a>
          </li>
      </ul>
      <p *ngIf="selected">Selected: <b>{{ selected }}</b></p>
  </modal-body>
  <modal-footer [show-default-buttons]="true"></modal-footer>
</modal>
  `
})
export class TermModal extends ModalComponent {
  //@Input()
  //@ViewChild('termModalModalComponent') private modal: ModalComponent;
  public modeler: any;
  // private IPIM_VAL : string = 'IPIM_Val';
  // private IPIM_META : string = 'IPIM_Meta';
  //@Input()
  public termList: any;

  @ViewChild('modal')
  public modal: ModalComponent;
  public items: string[] = ['item1', 'item2', 'item3'];
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

  /* constructor(modeler: any, termList: any) {
    super(modeler);
    console.log(this.constructor.name + ' Constructor');
    this.termList = termList;

    // this.fillModal(termList);
  } */


  protected fillModal(): void {
    console.log(this.constructor.name + ' fillModal');
  }

  public cancel(): void {
    this.dismiss();
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
            if ((<HTMLInputElement>document.getElementById('inputFieldTerm')).value !== '') {
              extras[0].values[i].value = (<HTMLInputElement>document.getElementById('inputFieldTerm')).value;
            } else {
              extras[0].values.splice(i, 1);
            }
            break;
          }
        }
      } else {
        if ((<HTMLInputElement>document.getElementById('inputFieldTerm')).value !== '') {
          element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
          const extras = element.businessObject.extensionElements.get('values');
          extras.push(moddle.create('camunda:Properties'));
          extras[0].values = [];
          extras[0].values.push(moddle.create('camunda:Property'));
          extras[0].values[0].name = 'IPIM_Calc';
          extras[0].values[0].value = (<HTMLInputElement>document.getElementById('inputFieldTerm')).value;
        }
      }
    });
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
