// import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input, ViewChild, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Variable } from "../variable";

import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { InputVarComponent } from "../InputComponent/input.component";
@Component({
  selector: "input-modal",
  templateUrl: "./InputModal.html",
})
export class InputModal {
  private IPIM_VAL: string = "IPIM_Val";
  private IPIM_META: string = "IPIM_Meta";
  private modeler: any;
  private data: any;
  public variables: Variable[] = [];
  public selected: string;
  public output: string;
  public index: number = 0;
  public cssClass: string = "";
  public animation: boolean = true;
  public keyboard: boolean = true;
  public backdrop: string | boolean = true;
  public css: boolean = false; // public setProps(modeler: any, root: any) {
  //   this.data.modeler = modeler;
  //   this.variables = [];
  //   this.data.modeler = root;
  // }
  constructor(
    // @Host() parent: ModelerComponent,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<InputModal>
  ) {
    this.variables = [];
    this.data = data;
    this.fillModal();
  }
  public cancel(): void {
    this.clearModal("inputfset");
  }
  public accept(): void {
    this.writeInputModalValues();
  }
  public opened() {
    this.fillModal();
  }
  public dismissed() {
    console.log("InputModal dismissed");
  }
  public closed() {
    console.log("InputModal closed");
  }
  public clearModal(s: string) {
    //Bereich zum Löschen per getElement abfragen
    const inpNode = document.getElementById(s);
    //Solange es noch ein firstChild gibt, wird dieses entfernt!
    while (inpNode.firstChild) {
      inpNode.removeChild(inpNode.firstChild);
    }
  }
  public writeInputModalValues() {
    //Objekte vom this.data.modeler holen um nicht immer so viel tippen zu müssen.    const elementRegistry = this.data.modeler.get('elementRegistry');    const modeling = this.data.modeler.get('modeling');
    //Alle Elemente der ElementRegistry holen
    const elements = this.data.modeler.elementRegistry.getAll(); //Alle Elemente durchlaufen um Variablen zu finden
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== "undefined") {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get("values");
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (
              extras[0].values[i].name
                .toLowerCase()
                .startsWith("IPIM_Val_".toLowerCase())
            ) {
              let inpelement = "Error Variable not found";
              for (let u = 0; u < this.variables.length; u++) {
                if (
                  ("IPIM_Val_" + this.variables[u].name).toLowerCase() ===
                  extras[0].values[i].name.toLowerCase()
                ) {
                  inpelement = this.variables[u].value;
                  break;
                }
              } //Variablen aus Inputfeld zurückschreiben

              extras[0].values[i].value = inpelement;
            }
          }
        }
      }
    });
    console.log("starting Evaluation");
    this.data.modeler.evaluateProcess();
    //inform other subscribers about action!    this.data.modeler.getCommandStack().publishXML();    //we are ready so close modal

    this.dialogRef.close();
  }
  public fillModal() {
    //Objekte vom this.data.modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = this.data.modeler.get("elementRegistry");
    const modeling = this.data.modeler.get("modeling"); //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll(); //Alle Elemente durchlaufen um Variablen zu finden

    for (const element of elements) {
      if (element.businessObject.extensionElements) {
        const extras = element.businessObject.extensionElements.get("values"); //'values');
        if (extras[0].values) {
          extras[0].values.map((extra: any, index: number) => {
            if (
              extras[0].values[index].name
                .toLowerCase()
                .startsWith(this.IPIM_VAL.toLowerCase() + "_")
            ) {
              this.addVar(
                extras[0].values[index].name
                  .toLowerCase()
                  .replace(this.IPIM_VAL.toLowerCase() + "_", ""),
                extras[0].values[index].value.toLowerCase(),
                false
              );
            }
          });
        }
      }
    }
  }
  public addVar(name: string, value: string, meta: boolean): void {
    this.variables.push(new Variable(name, value, meta));
  }
}
