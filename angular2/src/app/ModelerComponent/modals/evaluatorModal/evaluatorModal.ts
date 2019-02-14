// import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Router } from '@angular/router';
import { Variable } from '../variable';
import { InputVarComponent } from '../InputComponent/input.component';

@Component({
  selector: 'eval-modal',
  templateUrl: './evaluatorModal.html'
})

export class EvalModal extends BsModalComponent {
  private IPIM_VAL : string = 'IPIM_Val';
  private IPIM_META : string = 'IPIM_Meta';

  private modeler : any;
  private root : any;

  public variables: Variable[] = [];

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

  public setProps(modeler: any, root: any, variables: Variable[]) {
    this.modeler = modeler;
    this.variables = variables;
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
    console.log('clear executed');
  }

  private writeInputModalValues() {
    this.root.getEvaluator().evaluateProcesses(this.variables);
    this.root.showOverlay();
    this.modal.close();
  }

  public fillModal() {
    console.log('filled modal');
  }

}