import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverviewComponent } from "./overview.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ModelLoaderComponent } from "../components/ModelLoaderComponent/modelloader.component";
import { ModelerComponent } from "../ModelerComponent/modeler.component";

import { Ng2SearchPipeModule } from "ng2-search-filter";
import { TermModal } from "../ModelerComponent/modals/TermModal/TermModal";
import { VariableModal } from "../ModelerComponent/modals/VariableModal/VariableModal";
import { InputModal } from "../ModelerComponent/modals/InputModal/InputModal";
import { SubProcessModal } from "../ModelerComponent/modals/SubProcessModal/SubProcessModal";
import { EvalModal } from "../ModelerComponent/modals/evaluatorModal/evaluatorModal";
import { SaveModal } from "../ModelerComponent/modals/SaveModal/SaveModal";
import { UsageModal } from "../ModelerComponent/modals/UsageModal/UsageModal";
import { VariableComponent } from "../ModelerComponent/modals/VariablesComponent/variables.component";
import { InputVarComponent } from "../ModelerComponent/modals/InputComponent/input.component";
import { BsModalModule } from "ng2-bs3-modal";
import { RouterModule, ROUTES, Routes } from "@angular/router";
// import { AdministrationModule } from "./../administration/administration.module";
import { SharedModule } from "../shared.module";
import { OverviewRoutingModule } from "./overview-routing.module";
import { ModelLoaderModule } from "../components/ModelLoaderComponent/modelloader.module";
import { TabbarService } from "../services/tabbar.service";
import { AppHeaderModule } from "../components/AppHeaderComponent/header.module";
import { SharedLazyModule } from "../shared/shared-lazy.module";
import { SharedMaterialModule } from "../shared/material.module";

// import { FrontPageComponent} from './FrontPageComponent.component';
// import { HeaderComponent} from "../components/HeaderComponent/header.component"

/**
 * NgModule that includes all Material modules that are required to serve 
 * the Plunker.
 */

@NgModule({
  declarations: [
    OverviewComponent,
    ModelerComponent,

    TermModal,
    VariableModal,
    InputModal,
    SubProcessModal,
    EvalModal,
    SaveModal,
    UsageModal,
    VariableComponent,
    InputVarComponent,
    // ModelLoaderComponent,
    // AppHeaderComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    // AdministrationModule, 
    
    // BrowserAnimationsModule,
    ReactiveFormsModule,
    BsModalModule,
    Ng2SearchPipeModule,
    
    // MaterialModule,
    SharedModule,
    SharedLazyModule,
    ModelLoaderModule,
    OverviewRoutingModule,

    SharedMaterialModule,
    AppHeaderModule
  ],
  providers: [TabbarService], 
  
  entryComponents: [ TermModal,
    VariableModal,
    InputModal,
    SubProcessModal,
    EvalModal,
    SaveModal,
    UsageModal,
    VariableComponent,
    InputVarComponent],
})
export class OverviewModule {}
