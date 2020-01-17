import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { SnackBarMessage } from "./snackBarMessage";
import { IPIM_OPTIONS } from "../modelerConfig.service";

@Injectable()
export class TabbarService {

  private modelTabs: any[] = [];
  private modelSubject = new Subject<any>();

  public addTab(model: any) {
    if(!this.modelTabs.includes(model)){
      this.modelTabs.push(model);
      this.modelSubject.next(this.modelTabs);
    }
  }

  public removeTab(index: number) {
    this.modelTabs.splice(index, 1);
    this.modelSubject.next(this.modelTabs);
  }

  public getModelTabs(): Observable<any> {
    return this.modelSubject.asObservable();
  }
}
