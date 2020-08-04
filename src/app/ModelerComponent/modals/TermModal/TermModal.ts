// import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input, ViewChild, Host, Inject } from "@angular/core";
import { BsModalComponent, BsModalService } from "ng2-bs3-modal";
import { Router } from "@angular/router";
import { ModelerComponent } from "../../modeler.component";

import {FormBuilder, Validators, FormGroup} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
@Component({
  selector: "term-modal",
  templateUrl: "./TermModal.html",
})
export class TermModal {
  public firstTerm: any;
  public parent: any;

  @ViewChild("modal")
  // public modal: BsModalComponent;
  public selected: string;
  public output: string;
  public index: number = 0;
  public form : any;
  public cssClass: string = "";

  public animation: boolean = true;
  public keyboard: boolean = true;
  public backdrop: string | boolean = true;
  public css: boolean = false;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<TermModal>) { 
    this.form = fb.group({
      description: ['description', Validators.required],
      // category: [category, Validators.required],
      // releasedAt: [moment(), Validators.required],
      longDescription: ['longDescription',Validators.required]
  });
    
  // constructor(@Host() parent: ModelerComponent,''
              // private modalService: BsModalService ) {
    this.parent = data;
    console.log(data)
    data.terms.length > 0
      ? (this.firstTerm = data.terms[0])
      : (this.firstTerm = " ");
    // this.modal.open();
  }
  public opened() {
    console.log("TermModal Opended");
    this.fillTermModal();
  }

  protected fillModal(): void {
    console.log(this.constructor.name + " fillModal");
  }

  public dismissed() {
    console.log("TermModal dismissed");
  }

  public close() {
    console.log("TermModal closed");
  }

  public cancel(): void {
    // this.modal.dismiss();
  }

  //get first selected term, show warning if more are selected
  private fillTermModal() {
    const terms = this.parent.terms;
    terms.length > 1
      ? window.alert(
          "Attention! Selected Elements already have different Terms!"
        )
      : null;
  }

  public writeTermModalValues() {
    //get moddle Object
    const moddle = this.parent.modeler.get("moddle");
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elements = this.parent.modeler.get("selection").get();
    //Alle Elemente durchlaufen um Variablen zu finden
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== "undefined") {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get("values");
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM_Calc entspricht
            if (
              extras[0].values[i].name
                .toLowerCase()
                .startsWith("IPIM_Calc".toLowerCase())
            ) {
              if (this.firstTerm !== "") {
                extras[0].values[i].value = this.firstTerm;
              } else {
                extras[0].values.splice(i, 1);
              }
              break;
            }
          }
        }
      } else {
        //if element does not exist create it!
        if (this.firstTerm !== "") {
          element.businessObject.extensionElements = moddle.create(
            "bpmn:ExtensionElements"
          );
          const extras = element.businessObject.extensionElements.get("values");
          extras.push(moddle.create("camunda:Properties"));
          extras[0].values = [];
          extras[0].values.push(moddle.create("camunda:Property"));
          extras[0].values[0].name = "IPIM_Calc";
          extras[0].values[0].value = this.firstTerm;
        }
      }
    });
    // this.modal.close();
    this.dialogRef.close(true)
  }
}
