import { Component } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { AdamoMqttService } from "../../services/mqtt.service";
import { SnackBarService } from "../../services/snackbar.service";

@Component({
  selector: "model-management",
  templateUrl: "./model.template.html"
})
export class ModelComponent {
  private selected: any;
  private newModel: any;
  private models: any;

  constructor(
    private apiService: ApiService,
    private snackbarService: SnackBarService,
    private mqttService: AdamoMqttService
  ) {}

  public ngOnInit() {
    //defines the structure for a new empty model
    this.newModel = {
      modelname: "",
      version: "",
      lastchange: ""
    };

    this.getAllModels();

    this.mqttService.getClient().subscribe("administration/model/#");
    const i = this;
    this.mqttService.getClient().on("message", (topic: any, message: any) => {
      if (topic.startsWith("administration/model")) {
        console.log("Test from remote:" + message.toString());
        i.getAllModels();
      }
    });
  }

  //gets a list of all models from DB
  public getAllModels() {
    this.models = [];

    this.apiService.getAllModels().subscribe(
      (response: { success: any; data: any; _body: string }) => {
        if (response.success) {
          this.models = response.data;
          this.selected = null;
        } else {
          this.snackbarService.error(response._body);
        }
      },
      (error: { _body: string }) => {
        console.log(error);
        this.snackbarService.error(JSON.parse(error._body).status);
      }
    );
  }

  //updates the selected model
  public modelUpdate() {
    this.apiService
      .modelUpdate(
        this.selected.mid,
        this.selected.modelname,
        this.selected.lastchange,
        this.selected.modelxml,
        this.selected.version
      )
      .subscribe(
        (response: { success: any; status: string }) => {
          if (response.success) {
            this.mqttService
              .getClient()
              .publish("administration/model/update", JSON.stringify({}));
            this.snackbarService.success(response.status);
          }
        },
        (error: { _body: string }) => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        }
      );
  }

  //creates a new model
  public modelCreate() {
    this.apiService
      .modelCreate(this.selected.modelname, this.selected.modelxml)
      .subscribe(
        (response: { success: any; status: string }) => {
          if (response.success) {
            this.mqttService
              .getClient()
              .publish("administration/model/create", JSON.stringify({}));
            this.snackbarService.success(response.status);
          }
        },
        (error: { _body: string }) => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        }
      );
  }

  //deletes the selected model
  public modelDelete() {
    this.apiService
      .modelDelete(this.selected.mid, this.selected.version)
      .subscribe(
        (response: { success: any; status: string }) => {
          if (response.success) {
            this.mqttService.getClient().publish(
              "administration/model/delete",
              JSON.stringify({
                mid: this.selected.mid,
                version: this.selected.version
              })
            );
            this.snackbarService.success(response.status);
          }
        },
        (error: { _body: string }) => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        }
      );
  }
}
