import { AbstractCustomModal } from './AbstractCustomModal';

export class TermModal extends AbstractCustomModal {

    // private IPIM_VAL : string = 'IPIM_Val';
    // private IPIM_META : string = 'IPIM_Meta';
    private termList : any ;
    constructor(modeler: any, termList: any) {
        super(modeler);
        console.log('TermModal Constructor');
        this.termList = termList;
        // this.fillModal(termList);
    }
    protected fillModal() : void {
        console.log('TermModal fillModal');
    }

    public cancel() : void {
        this.dismiss();
    }
    public accept() {
        console.log('TermModal fillModal');
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

    // this.termsColored
    //   ? this.toggleTermsColored()
    //   : this.toggleTermsNormal();
  }
}