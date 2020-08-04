import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { SnackBarMessage } from './snackBarMessage';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { AdamoMqttService } from './mqtt.service';
import { CollaborationModelEntity } from '../models/CollaborationModelEntity';

@Injectable()
export class TabbarService {

  constructor(private adamoMqttService: AdamoMqttService) {}

  private modelTabs: CollaborationModelEntity[] = [];
  private modelSubject = new Subject<any>();

  public addTab(model: CollaborationModelEntity) {
    const existingModel = this.modelTabs.find((element) => element.id === model.id && element.model_version === model.model_version);
    if (!existingModel) {
      this.modelTabs.push(model);
      const topic = 'MODEL/model_' + model.id + '_' + model.model_version;
      this.adamoMqttService.subscribe(topic);
      this.modelSubject.next(this.modelTabs);
    }
  }

  public removeTab(index: number) {
    const removedModel = this.modelTabs.splice(index, 1);
    const topic = 'MODEL/model_' + removedModel[0].id + '_' + removedModel[0].model_version;
    this.adamoMqttService.unsubscribe(topic);
    this.modelSubject.next(this.modelTabs);
  }

  public getModelTabs(): Observable<any> {
    return this.modelSubject.asObservable();
  }
}
