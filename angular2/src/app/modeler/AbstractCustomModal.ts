import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

export abstract class AbstractCustomModal extends ModalComponent {

  protected modeler: any;
  protected IPIM_VAL: string = 'IPIM_Val';
  protected IPIM_META: string = 'IPIM_Meta';
  protected IPIM_CALC: string = 'IPIM_Calc';

  constructor(modeler: any) {
    super(modeler);
    this.modeler = modeler;
  }

  public abstract accept(): void;
  public abstract cancel(): void;
  protected abstract fillModal(): void;

  // private abstract fillModal = (modeler : any) => {};

  protected clearModal(elementName: string) {
    //Bereich zum löschen per getElement abfragen
    const inpNode = document.getElementById(elementName);
    //Solange es noch ein firstChild gibt, wird dieses entfernt!
    while (inpNode.firstChild) {
      inpNode.removeChild(inpNode.firstChild);
    }
  }
}