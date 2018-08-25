import {Injectable} from '@angular/core';
import {Component, ViewChild} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {Model} from '../../../models/model';
import {ApiService} from '../../../services/api.service';
import {Http} from '@angular/http';

const bigInt = require('big-integer');

@Component({
  selector: 'save-modal',
  templateUrl: './SaveModal.html'
})

@Injectable()
export class SaveModal extends ModalComponent {

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
  public modal: ModalComponent;

  public setModel(model: Model, xml: string, apiService: ApiService) {
    this.xml = xml;
    this.model = model;
    this.apiService = apiService;
    this.version1 = bigInt(model.version).shiftRight(48);
    this.version2 = bigInt(model.version).and(bigInt('0000FFFF00000000', 16)).shiftRight(32);
    this.version3 = bigInt(model.version).and(bigInt('00000000FFFF0000', 16)).shiftRight(16);
    this.version4 = bigInt(model.version).and(bigInt('000000000000FFFF', 16));
  }
  public saveSuperVersion() {
    console.log(2);
  }
  public saveWithVersion() {
    this.model.version =
      bigInt(this.version1).shiftLeft(48) +
      bigInt(this.version2).shiftLeft(32) +
      bigInt(this.version3).shiftLeft(16) +
      bigInt(this.version4);
    this.apiService.modelUpsert(this.model.id, this.model.name, this.xml, this.model.version)
    .subscribe(response => {
      if (response.status === 'Next Version already exists') {
        this.alsoExists = true;
        return;
      }
        this.alsoExists = false;
        console.log(response);
        this.modal.close();
      },
      error => {
        console.log(error);
      });
  }

  public opened() {
  }

  private dismissed() {
  }

  private closed() {
  }

  public cancel(): void {
    this.dismiss();
  }

  public clearModal(s: string) {
    //Bereich zum Löschen per getElement abfragen
    //let changed to const, because it was never assigned
    const inpNode = document.getElementById(s);
    //Solange es noch ein firstChild gibt, wird dieses entfernt!
    while (inpNode.firstChild) {
      inpNode.removeChild(inpNode.firstChild);
    }
  }

  public accept(): void {
    console.log('VariableModal accept');
  }
}