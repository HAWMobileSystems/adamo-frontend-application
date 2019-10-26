import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdministrationRoutingModule } from "./administration-routing.module";
import { AdministrationComponent } from "./administration.component";
import { UserComponent } from "./UserComponent/user.component";
import { ModelComponent } from "../components/ModelComponent/model.component";
import { RoleComponent } from "./RoleComponent/role.component";
import { ProfileComponent } from "./ProfileComponent/profile.component";
import { PermissionComponent } from "./PermissionComponent/permission.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared.module";
import { UserService } from "../services/user.service";
// import { ChooseAddressComponent } from './choose-address.component';

@NgModule({
  imports: [
    AdministrationRoutingModule,
    CommonModule,
    FormsModule,
    Ng2SearchPipeModule,
    SharedModule
    // ChooseAddressRoutingModule,
  ],
  declarations: [
    AdministrationComponent,
    UserComponent,
    ModelComponent,
    RoleComponent,
    ProfileComponent,
    PermissionComponent
  ],
  providers: [UserService]
})
export class AdministrationModule {}
