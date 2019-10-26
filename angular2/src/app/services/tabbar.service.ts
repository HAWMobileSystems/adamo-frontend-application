import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { SnackBarMessage } from "./snackBarMessage";
import { IPIM_OPTIONS } from "../modelerConfig.service";

@Injectable()
export class TabbarService {

  private modelTabs: any[] = [];

  public addTab(model: any) {
    this.modelTabs.push(model);
  }

  public removeTab(index: number) {
    this.modelTabs.splice(index, 1);
  }

  public getModelTabs() {
      return this.modelTabs;
  }
}
