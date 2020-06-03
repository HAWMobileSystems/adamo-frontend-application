import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { ModelDto } from "../entities/interfaces/ModelDto";

const options = {
  withCredentials: true,
};

@Injectable()
export class ModelService {
  constructor(public http: HttpClient) {}
  private BACKEND_URI: string =
    environment.SERVER_HOST + ":" + environment.SERVER_PORT;

  //Modeller: changes to model in last 7 days
  public getModelsChangedLast7Days() {
    return this.http.get(this.BACKEND_URI + "/model/changes", options);
    //.pipe(map((response: any) => response.json()));
  }

  //Modeller: Load model
  public getModel(mid: string, version?: string) {
    return (
      this.http
        // .post(
        .get(
          this.BACKEND_URI + `/model/${mid}/${version}`,
          // { mid: mid, version: version },
          options
        )
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Modeller: Evaluation needs asynchron loading of model
  public async getModelAsync(mid: string): Promise<ModelDto> {
    try {
      const response: any = await this.http
        .get(this.BACKEND_URI + `/model/${mid}`, options)
        .toPromise();
      const responseString = String.fromCharCode.apply(
        null,
        new Uint8Array(response)
      );
      return <ModelDto>
        {}
        // (
        //   responseString.json().data.modelname,
        //   responseString.json().data.mid.toString(),
        //   responseString.json().data.modelxml
        // )
    } catch {
      return <ModelDto> {id: "", modelName: "", modelXML: "", modelVersion: 1};
    }
  }

  //Administration page: Show all models
  //modellerPage: Show all models
  public getAllModels() {
    return this.http.get(this.BACKEND_URI + "/model/all", options);
    //.pipe(map((response: any) => response.json()));
  }

  public getAllModelsForUser(id: string) {
    return this.http.get(this.BACKEND_URI + `/model/all/${id}`, options);
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Delete model
  public modelDelete(mid: number, version: string) {
    return this.http.post(
      this.BACKEND_URI + "/model/delete",
      { mid: mid, version: version },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Modeller: Update model triggers insert of a new database entry with new version number (upsert)
  public modelUpsert(
    id: number,
    modelName: string,
    modelXml: string,
    modelVersion: string
  ) {
    return this.http.post(
      this.BACKEND_URI + "/model/upsert",
      {
        id: id,
        modelName: modelName,
        modelXml: modelXml,
        modelVersion: modelVersion,
      },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Update model information
  public modelUpdate(
    mid: number,
    modelname: string,
    lastchange: string,
    modelxml: string,
    version: string
  ) {
    return this.http.post(
      this.BACKEND_URI + "/model/update",
      {
        mid: mid,
        modelname: modelname,
        lastchange: lastchange,
        modelxml: modelxml,
        version: version,
      },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }
  public modelClose(mid: number, version: string) {
    return this.http.post(
      this.BACKEND_URI + "/model/close",
      {
        mid: mid,
        version: version,
      },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }

  //Administration page: Create a new model
  //modellerPage: Create a new model
  public modelCreate(modelname: string, modelxml: string) {
    return this.http.post(
      this.BACKEND_URI + "/model/create",
      {
        modelName: modelname,
        modelXML: modelxml,
        modelVersion: 1
      },
      options
    );
    //.pipe(map((response: any) => response.json()));
  }
}
