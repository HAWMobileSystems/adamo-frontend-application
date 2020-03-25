
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared.module";
import { ModelLoaderComponent } from "./modelloader.component";
// import { ChooseAddressComponent } from './choose-address.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2SearchPipeModule,
    SharedModule
    // ChooseAddressRoutingModule,
  ],
  declarations: [ModelLoaderComponent]
})
export class ModelLoaderModule {}
