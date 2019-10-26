import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverviewComponent } from "./overview.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AuthService } from "../services";
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
import { AdministrationModule } from "../administration/administration.module";
import { SharedModule } from "../shared.module";
import { OverviewRoutingModule } from "./overview-routing.module";
import { ModelLoaderModule } from "../components/ModelLoaderComponent/modelloader.module";
import { TabbarService } from "../services/tabbar.service";
import { AppHeaderComponent } from "../components/AppHeaderComponent/header.component";
// import { FrontPageComponent} from './FrontPageComponent.component';
// import { HeaderComponent} from "../components/HeaderComponent/header.component"

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
    // ModelLoaderComponent,
    InputVarComponent,
    AppHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdministrationModule, 
    ReactiveFormsModule,
    BsModalModule,
    Ng2SearchPipeModule,
    SharedModule,
    OverviewRoutingModule,
    ModelLoaderModule
  ],
  providers: [TabbarService],
  exports: [RouterModule]
})
export class OverviewModule {}
