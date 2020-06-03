import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { Router } from "@angular/router";
import { Http, Jsonp } from "@angular/http";
import { PaletteProvider } from "./palette/palette";
import { CustomPropertiesProvider } from "./properties/props-provider";
import { BPMNStore, Link } from "../bpmn-store/bpmn-store.service";
import { CommandStack } from "./command/CommandStack";
//import {customModdle} from './custom-moddle';
import { camundaModdle } from "./camunda-moddle";
import { Observable, Subject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { BaseModelerComponent } from "./BaseModeler.component";


@Component({
  selector: "simplemodeler",
  templateUrl: "./simplemodeler.component.html",
  styleUrls: ["./modeler.component.css"],
  providers: [BPMNStore]
})
export class SimpleModelerComponent extends BaseModelerComponent {


  constructor(
    protected http: Http,
    protected store: BPMNStore,
    protected ref: ChangeDetectorRef,
    protected router: Router,
    protected logger: NGXLogger
  ) {
    super(http, store, ref, router, logger);
  }
}
