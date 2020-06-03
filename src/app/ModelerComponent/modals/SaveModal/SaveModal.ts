import {Injectable, Inject} from '@angular/core';
import {Component, ViewChild} from '@angular/core';
import {BsModalComponent} from 'ng2-bs3-modal';
import {Model} from '../../../models/model';
import {ApiService} from '../../../services/api.service';
import {Http} from '@angular/http';
import { ModelDto } from '../../../entities/interfaces/ModelDto';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TermModal } from '../TermModal/TermModal';

const bigInt = require('big-integer');

@Component({
  selector: 'save-modal',
  templateUrl: './SaveModal.html'
})

@Injectable()
export class SaveModal {

  public apiService: ApiService;
  public root: any;
  public xml: string;
  public version;
  public model: ModelDto;
  public version1: number;
  public version2: number;
  public version3: number;
  public version4: number;
  public alsoExists: boolean = false;

  // @ViewChild('modal')
  // public modal: BsModalComponent;

   constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<TermModal>) { 

    this.version = data.version;

  }
  public setModel(model: ModelDto, xml: string, apiService: ApiService, root: any) {
    this.root = root;
    this.xml = xml;
    this.model = model;
    this.apiService = apiService;
    // this.version1 = bigInt(model.version).shiftRight(48);
    // this.version2 = bigInt(model.version).and(bigInt('0000FFFF00000000', 16)).shiftRight(32);
    // this.version3 = bigInt(model.version).and(bigInt('00000000FFFF0000', 16)).shiftRight(16);
    // this.version4 = bigInt(model.version).and(bigInt('000000000000FFFF', 16));
  }
  public saveSuperVersion() {
    this.apiService.modelUpsert(this.model.id, this.model.modelName, this.model.modelXML, this.model.modelVersion)
    .subscribe((response: { status: string; }) => {
      if (response.status === 'Next Version already exists') {
        this.alsoExists = true;
        return;
      }
        this.alsoExists = false;
        console.log(response);
        this.saveSubProcesses();
        // this.modal.close();
      },
      (      error: any) => {
        console.log(error);
      });
  }
  public saveWithVersion() {
    // this.model.version =
    //   bigInt(this.version1).shiftLeft(48) +
    //   bigInt(this.version2).shiftLeft(32) +
    //   bigInt(this.version3).shiftLeft(16) +
    //   bigInt(this.version4);
    this.apiService.modelUpsert(this.model.id, this.model.modelName, this.model.modelXML, this.model.modelVersion)
    .subscribe((response: { status: string; }) => {
      if (response.status === 'Next Version already exists') {
        this.alsoExists = true;
        return;
      }
        this.alsoExists = false;
        console.log(response);
        this.saveSubProcesses();
        // this.modal.close();
      },
      (      error: any) => {
        console.log(error);
      });
  }
  //save all active subprocesses for this model/version
  public saveSubProcesses() {
  const partmodels = this.root.returnSubProcessList(this.root.lookup.ELEMENTREGISTRY);
    partmodels.forEach((pmid: string) => {
    this.apiService.partModelCreate(this.root.modelId.split('_')[1], this.root.modelId.split('_')[2], pmid)
      .subscribe((response: any) => {
        console.log(response);
      });
    });
  }


  public close() {
    console.log('SaveModal closed');
  }


  public accept(): void {
    console.log('VariableModal accept');
  }
}