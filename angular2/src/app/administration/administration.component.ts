
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { AdamoMqttService } from "../services/mqtt.service";
import { SnackBarService } from "../services/snackbar.service";
import { Router } from "@angular/router";

//Include components for interface and styling
@Component({
  templateUrl: "./modellerPage.component.html",
  styleUrls: ["./modellerPage.component.css"]
})
export class AdministrationComponent  {
    constructor(
        // private apiService: ApiService,
        // private router: Router,
        // private mqttService: AdamoMqttService,
        // private snackbarService: SnackBarService
      ) {}
}