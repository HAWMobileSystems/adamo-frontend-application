import { AbstractCustomModal } from './AbstractCustomModal';

export class InputModal extends AbstractCustomModal {

    // private IPIM_VAL : string = 'IPIM_Val';
    // private IPIM_META : string = 'IPIM_Meta';

    constructor(modeler: any) {
        super(modeler);
        console.log('TermModal Constructor');
        this.fillModal(modeler);
    }

    private fillModal() : void {
        console.log('TermModal fillModal');
        //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
        const elementRegistry = this.modeler.get('elementRegistry');
        const modeling = this.modeler.get('modeling');
        //Alle Elemente der ElementRegistry holen
        const elements = elementRegistry.getAll();
        const element = elements[0];
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (typeof element.businessObject.extensionElements !== 'undefined') {
            //Wenn vorhandne die Elemente auslesen
            const extras = element.businessObject.extensionElements.get('values');
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
                //Prüfen ob der Name des Elementes IPIM_Val entspricht
                const extrasValues = extras[0].values[i];
                const extrasValueNameLowerCase = extrasValues.name.toLowerCase();
                const startsWithIpimVal: boolean = extrasValueNameLowerCase.startsWith(this.IPIM_VAL + '_'.toLowerCase());
                const startsWithIpimMeta: boolean = extrasValueNameLowerCase.startsWith(this.IPIM_META + '_'.toLowerCase());

                if (startsWithIpimVal) {
                    this.insertVariableField(
                        extrasValues.name.toLowerCase().replace('IPIM_Val_'.toLowerCase(), ''),
                        extrasValues.value.toLowerCase(),
                        'variablefset',
                        false);
                }

                if (startsWithIpimMeta) {
                    this.insertVariableField(
                        extrasValues.name.toLowerCase().replace('IPIM_META_'.toLowerCase(), ''),
                        extrasValues.value.toLowerCase(),
                        'variablefset',
                        true);
                }
            }
        }
    }
    private cancel = () => {
        this.clearModal('inputfset');
        this.dismiss();
    }

    private clearVariableModal() {
        //Bereich zum löschen per getElement abfragen
        const inpNode = document.getElementById('variablefset');
        //Solange es noch ein firstChild gibt, wird dieses entfernt!
        while (inpNode.firstChild) {
            inpNode.removeChild(inpNode.firstChild);
        }
    }
    // TODO: FIxme in a template?
    private insertVariableField = (pname: string, inpval: string, pform: string, meta: boolean) => {
        const inputField = document.createElement('input');
        inputField.setAttribute('type', 'text');
        inputField.setAttribute('name', 'textbox');
        inputField.setAttribute('value', pname);
        inputField.setAttribute('id', 'Variable_IPIM_Val_'.toLowerCase() + pname.toLowerCase());

        const valueField = document.createElement('input');
        valueField.setAttribute('type', 'text');
        valueField.setAttribute('name', 'valuebox');
        valueField.setAttribute('value', inpval);
        valueField.setAttribute('class', 'maxwid');
        valueField.setAttribute('id', 'Variable_IPIM_Val_'.toLowerCase() + pname.toLowerCase());

        // (<HTMLElement> checkingBox).attr({"data-test-1":'num1', "data-test-2": 'num2'});
        // $('#pform').append('<input>').attr({});

        const checkingbox = document.createElement('input');
        // checkingbox.attributes;
        checkingbox.setAttribute('type', 'checkbox');
        checkingbox.setAttribute('name', 'checkbox');
        checkingbox.setAttribute('value', 'Meta?');
        if (meta) {
            checkingbox.setAttribute('checked', meta.toString());
        }
        checkingbox.setAttribute('id', 'Variable_IPIM_'.toLowerCase() + pname.toLowerCase());

        const br = document.createElement('br');

        const node = document.createTextNode('Variable:     ');

        document.getElementById(pform).appendChild(node);
        document.getElementById(pform).appendChild(inputField);
        document.getElementById(pform).appendChild(document.createTextNode('    Meta?:'));
        document.getElementById(pform).appendChild(checkingbox);
        document.getElementById(pform).appendChild(document.createElement('br'));
        document.getElementById(pform).appendChild(document.createTextNode('    Default:'));
        document.getElementById(pform).appendChild(valueField);
        //document.getElementById(pform).appendChild(br);
        document.getElementById(pform).appendChild(br);
        document.getElementById(pform).appendChild(document.createElement('hr'));
    }



    // !! 


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
            const inpelement = 'Input_' + extras[0].values[i].name;
            //Variablen aus Inputfeld zurückschreiben
            extras[0].values[i].value = (<HTMLInputElement>document.getElementById(inpelement.toLowerCase())).value;
          }
        }
      }
    });
  }


  private fillInputModal() {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.businessObject.extensionElements) {
        const extras = element.businessObject.extensionElements.get(this.lookup.VALUES); //'values');
        extras[0].values.map((extra: any, index: number) => {
          if (extras[0].values[index].name.toLowerCase().startsWith(this.ipimTags.VAL.toLowerCase() + '_')) {
            this.insertInputField(
              extras[0].values[index].name.toLowerCase().replace(this.ipimTags.VAL.toLowerCase()  + '_', ''),
              extras[0].values[index].value.toLowerCase(),
              'inputfset');
          }
        }
        );
      }
    }
  }

   private insertInputField(pname: string, inpval: string, pform: string) {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('name', pname);
    inputField.setAttribute('value', inpval);
    inputField.setAttribute('id', 'Input_IPIM_Val_'.toLowerCase() + pname.toLowerCase());
    const br = document.createElement('br');

    const node = document.createTextNode('Variable ' + pname + ':     ');

    document.getElementById(pform).appendChild(node);
    document.getElementById(pform).appendChild(document.createElement('br'));
    document.getElementById(pform).appendChild(inputField);
    //document.getElementById(pform).appendChild(br);
    document.getElementById(pform).appendChild(br);

  }
}