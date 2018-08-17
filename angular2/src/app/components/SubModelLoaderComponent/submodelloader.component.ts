import {Component, Output, Input, EventEmitter } from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';
import {Model} from '../../models/model';

@Component({
  selector: 'submodelloader',
  templateUrl: './submodelloader.template.html'
})

export class SubModelLoaderComponent {
  private models: any = [];
  private selectedModelName: any;
  @Input() public selectedId: any;
  @Output() public selectedIdChange: any = new EventEmitter<any>();

  constructor(private apiService: ApiService, private alertService: AlertService) {
  }

  public ngOnInit() {
    this.getAllModels();
  }

  public selectionChanged(model: any) {
    this.selectedModelName = model.modelname;
    this.selectedId = model.mid;
    this.selectedIdChange.emit(this.selectedId);
    console.log(this.selectedId);
  }

  public getAllModels() {

    this.apiService.getAllModels()
      .subscribe(response => {
          if (response.success) {
            this.models = response.data;

          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}
