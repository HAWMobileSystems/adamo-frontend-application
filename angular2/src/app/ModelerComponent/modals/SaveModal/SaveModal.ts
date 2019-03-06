import {Injectable} from '@angular/core';
import {Component, ViewChild} from '@angular/core';
import {BsModalComponent} from 'ng2-bs3-modal';
import {Model} from '../../../models/model';
import {ApiService} from '../../../services/api.service';
import {Http} from '@angular/http';

const bigInt = require('big-integer');

@Component({
  selector: 'save-modal',
  templateUrl: './SaveModal.html'
})

@Injectable()
export class SaveModal extends BsModalComponent {

  public apiService: ApiService;
  public root: any;
  public xml: string;
  public model: Model;
  public version1: number;
  public version2: number;
  public version3: number;
  public version4: number;
  public alsoExists: boolean = false;

  @ViewChild('modal')
  public modal: BsModalComponent;

  public setModel(model: Model, xml: string, apiService: ApiService, root: any) {
    this.root = root;
    this.xml = xml;
    this.model = model;
    this.apiService = apiService;
    this.version1 = bigInt(model.version).shiftRight(48);
    this.version2 = bigInt(model.version).and(bigInt('0000FFFF00000000', 16)).shiftRight(32);
    this.version3 = bigInt(model.version).and(bigInt('00000000FFFF0000', 16)).shiftRight(16);
    this.version4 = bigInt(model.version).and(bigInt('000000000000FFFF', 16));
  }
  public saveSuperVersion() {
    this.apiService.modelUpsert(this.model.id, this.model.name, this.xml, this.model.version)
    .subscribe((response: { status: string; }) => {
      if (response.status === 'Next Version already exists') {
        this.alsoExists = true;
        return;
      }
        this.alsoExists = false;
        console.log(response);
        this.saveSubProcesses();
        this.modal.close();
      },
      (      error: any) => {
        console.log(error);
      });
  }
  public saveWithVersion() {
    this.model.version =
      bigInt(this.version1).shiftLeft(48) +
      bigInt(this.version2).shiftLeft(32) +
      bigInt(this.version3).shiftLeft(16) +
      bigInt(this.version4);
    this.apiService.modelUpsert(this.model.id, this.model.name, this.xml, this.model.version)
    .subscribe((response: { status: string; }) => {
      if (response.status === 'Next Version already exists') {
        this.alsoExists = true;
        return;
      }
        this.alsoExists = false;
        console.log(response);
        this.saveSubProcesses();
        this.modal.close();
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

  public opened() {
    console.log('SaveModal opened');
  }

  private dismissed() {
    console.log('SaveModal dismissed');
  }

  private closed() {
    console.log('SaveModal closed');
  }

  public cancel(): void {
    this.dismiss();
  }

  public accept(): void {
    console.log('VariableModal accept');
  }
}