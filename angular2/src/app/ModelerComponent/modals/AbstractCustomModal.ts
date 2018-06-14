import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

export abstract class AbstractCustomModal extends ModalComponent {

  //protected modeler: any;
  protected IPIM_VAL: string = 'IPIM_Val';
  protected IPIM_META: string = 'IPIM_Meta';
  protected IPIM_CALC: string = 'IPIM_Calc';

  public abstract accept(): void;
  public abstract cancel(): void;
 // protected abstract fillModal(): void;

  // private abstract fillModal = (modeler : any) => {};

  protected clearModal(elementName: string) {
    document.getElementById(elementName).innerHTML = '';
  }
}