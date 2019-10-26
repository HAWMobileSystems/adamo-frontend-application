
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { AdamoMqttService } from "../services/mqtt.service";
import { SnackBarService } from "../services/snackbar.service";
import { Router } from "@angular/router";

//Include components for interface and styling
@Component({
  templateUrl: "./administration.component.html",
  // styleUrls: ["./modellerPage.component.css"]
})
export class AdministrationComponent  {
    constructor(
        // private apiService: ApiService,
        // private router: Router,
        // private mqttService: AdamoMqttService,
        // private snackbarService: SnackBarService
      ) {}

      onButtonGroupClick($event: any){
        let clickedElement = $event.target || $event.srcElement;
        if( clickedElement.nodeName === "BUTTON" ) {
    
          let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".is-selected");
          // if a Button already has Class: .active
          // if( isCertainButtonAlreadyActive ) {
          //   isCertainButtonAlreadyActive.classList.remove("active");
          // }
    
          clickedElement.className += " is-info";
        }
    
      }
}