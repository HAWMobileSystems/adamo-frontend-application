// import { AbstractCustomModal } from '../AbstractCustomModal';
import { Component, Input , ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal/';
import { Router } from '@angular/router';
import { Model } from '../../../models/model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'usage-modal',
  templateUrl: './UsageModal.html'
})

export class UsageModal extends BsModalComponent {

  public modeler: any;

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
  public root: any;
  public referencingModels: any[] = [];  //[{mid: '2', modelname: 'Testname', version: 'test'}];
  public noReferences: boolean = true;
  public apiService: ApiService;
  public loading: boolean;

  public setProps(modeler: any, root: any, apiService: ApiService) {
    this.modeler = modeler;
    this.root = root;
    this.apiService = apiService;
    this.selected = '';
    this.referencingModels = [];
    this.loading = true;
    this.getSubPartModelsFromDB();
  }

  //get a list of all processes that refernce this model!
  private getSubPartModelsFromDB() {
    this.apiService.getPartModelUsage(this.root.modelId.split('_')[1])
    .subscribe((response: { data: any[]; }) => {
      this.referencingModels = response.data;
      console.log('Received referencing Processes', response.data);
      this.loading = false;
    },
      (    error: any) => {
      this.root.snackbarService.newSnackBarMessage(error);
      console.log(error);
    });
  }

  private opened() {
    console.log('UsageModal Opended');
  }

  protected fillModal(): void {
    console.log(this.constructor.name + ' fillModal');
  }

  private dismissed() {
    console.log('UsageModal dismissed');
  }

  private closed() {
    console.log('UsageModal closed');
  }

  public cancel(): void {
    this.dismiss();
  }

  private  fillUsageModal() {
    console.log('UsageModal fill');
  }

  private closeModal() {
    this.modal.close();
  }
}
