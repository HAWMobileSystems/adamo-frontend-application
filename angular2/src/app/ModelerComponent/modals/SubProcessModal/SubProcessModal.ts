// import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input , ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Router } from '@angular/router';
import { Model } from '../../../models/model';

@Component({
  selector: 'subprocess-modal',
  templateUrl: './SubProcessModal.html'
})

export class SubProcessModal extends BsModalComponent {

  public modeler: any;
  public models: any = [];
  public selectedModelName: any;

  public subProcessList: any;
  public firstSubprocess: any;
  public selectedModel: any;

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
  public root: any;
  public loading: boolean = true;

  public setProps(modeler: any, subProcessList: any, root: any) {
     this.subProcessList = subProcessList;
    this.modeler = modeler;
    this.root = root;
    if (subProcessList.length > 0) {this.firstSubprocess = subProcessList[0]; } else {this.firstSubprocess = ' '; }
    this.loading = true;
    this.getAllModels();
  }

  //get a list of all possible processes of models in database to reference
  public getAllModels() {
    this.root.apiService.getAllModels()
      .subscribe((response: any) => {
          this.loading = false;
          if (response.success) {
            this.models = response.data;
            this.models.forEach((element: any) => {
              if (element.mid.toString() === this.firstSubprocess) {
                this.selectedModelName = element.modelname;
                this.selectedModel = element;
              }
            });

          } else {
            this.root.snackbarService.error('Could not get permissons');
            console.log(response._body);
          }
        },
        (error: any) => {
          this.loading = false;
          this.root.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
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
    //take subprocess list and display first item, warn if more than one is selected
    const terms = this.subProcessList;

    if (terms.length > 1) {window.alert('Attention! Selected Elements already have different SubProcesses!'); }

  }

  private writeSubprocessModalValues() {
    const firstSubprocessString = this.selectedModel.mid.toString();
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
        if (extras[0].values) {
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
          //value is found so update it
        if (!found) {
          extras[0].values.push(moddle.create('camunda:Property'));
          extras[0].values[extras[0].values.length - 1].name = 'IPIM_SubProcess';
          extras[0].values[extras[0].values.length - 1].value = firstSubprocessString.trim();
        }
        }
      } else {
        //value does not exist so create it
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
    //update other subscribers about changes
    this.root.getCommandStack().publishXML();
    //close modal, process is finished
    this.modal.close();
  }

  //update current selction variables, whenever the list is clicked
  public selectionChanged(model: any) {
    this.selectedModel = model;
    this.selectedModelName = model.modelname;
    console.log(this.selectedModel);
  }

  //opens the selected subprocess in a new tab
  public openSubProcessModel() {
    //make sure something is selected
    if (typeof this.selectedModel === 'undefined') {
      window.alert('Noting selected!');
      return;
    }
    //show loading overlay
    this.root.showOverlay();
    //create a new model with the selected information
    const model = new Model(this);
    model.xml = this.selectedModel.modelxml;
    model.name = this.selectedModel.modelname;
    model.id = this.selectedModel.mid;
    model.version = this.selectedModel.version;
    //if there is no data for the selected stop else get model from database
    if (this.selectedModel.mid !== '') {
      this.root.apiService.getModel(this.selectedModel.mid)
        .subscribe((response: any) => {
            model.xml = response.data.modelxml;
            console.info(model);
            //emit event for new model
            this.root.loadSubProcess.emit(model);
            //remove Overlay for user
            this.root.hideOverlay();
            this.root.snackbarService.newSnackBarMessage('successfully loaded', 'limegreen');
          },
          (error: any) => {
            //remove Overlay in any case
            this.root.hideOverlay();
            this.root.snackbarService.newSnackBarMessage('Error: ' + JSON.parse(error._body).status, 'red');
            console.log(error);
          });

    } else {
      window.alert('Noting selected!');
      return;
    }
    this.modal.close();
  }
}
