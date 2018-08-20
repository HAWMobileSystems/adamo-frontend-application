import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input , ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { SubModelLoaderComponent } from '../../../components/SubModelLoaderComponent/submodelloader.component';
import { Model } from '../../../models/model';

@Component({
  selector: 'subprocess-modal',
  templateUrl: './SubProcessModal.html'
})

export class SubProcessModal extends ModalComponent {

  public modeler: any;

  public subProcessList: any;
  public firstSubprocess: any;
  public selectedModel: any;

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
  public root: any;

  public setProps(modeler: any, subProcessList: any, root: any) {
    this.subProcessList = subProcessList;
    this.modeler = modeler;
    this.root = root;
    if (subProcessList.length > 0) {this.firstSubprocess = subProcessList[0]; } else {this.firstSubprocess = ' '; }
  }

  private opened() {
    console.log('SubprocessModal Opended');
  }

  protected fillModal(): void {
    console.log(this.constructor.name + ' fillModal');
  }

  private dismissed() {
    console.log('SubprocessModal dismissed');
  }

  private closed() {
    console.log('SubprocessModal closed');
  }

  public cancel(): void {
    this.dismiss();
  }

  private  fillSubprocessModal() {

    const terms = this.subProcessList;

    if (terms.length > 1) {window.alert('Attention! Selected Elements already have different SubProcesses!'); }

  }

  private writeSubprocessModalValues() {
    const firstSubprocessString = this.firstSubprocess.toString();
    console.log(firstSubprocessString);
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
            if (firstSubprocessString !== '') {
              extras[0].values[i].value = firstSubprocessString.trim();
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
          extras[0].values[extras[0].values.length - 1].value = firstSubprocessString.trim();
        }

      } else {
        if (firstSubprocessString !== '') {
          element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
          const extras = element.businessObject.extensionElements.get('values');
          extras.push(moddle.create('camunda:Properties'));
          extras[0].values = [];
          extras[0].values.push(moddle.create('camunda:Property'));
          extras[0].values[0].name = 'IPIM_SubProcess';
          extras[0].values[0].value = firstSubprocessString.trim();
        }
      }
    });
    this.root.getCommandStack().publishXML();
    this.modal.close();
  }

  public openSubProcessModel() {
    if (typeof this.selectedModel === 'undefined') {
      window.alert('Noting selected!');
      return;
    }
    this.root.showOverlay();
    const model = new Model();
    model.xml = this.selectedModel.modelxml;
    model.name = this.selectedModel.modelname;
    model.id = this.selectedModel.mid;
    model.version = this.selectedModel.version;
    if (this.selectedModel.mid !== '') {
      this.root.apiService.getModel(this.selectedModel.mid)
        .subscribe((response: any) => {
            model.xml = response.data.modelxml;
            console.info(model);
            this.root.loadSubProcess.emit(model);
            this.root.hideOverlay();
          },
          (error: any) => {
            this.root.hideOverlay();
            console.log(error);
          });

    } else {
      window.alert('Noting selected!');
      return;
    }
    this.modal.close();
  }
}
