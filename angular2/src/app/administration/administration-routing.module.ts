import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdministrationComponent } from "./administration.component";
import { UserComponent } from "./UserComponent/user.component";
import { RoleComponent } from "./RoleComponent/role.component";
import { PermissionComponent } from "./PermissionComponent/permission.component";
import { ModelComponent } from "../components/ModelComponent/model.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "settings",
        component: AdministrationComponent,
        children: [
          { path: "user", component: UserComponent },
          { path: "role", component: RoleComponent },
          { path: "permission", component: PermissionComponent },
          { path: "model", component: ModelComponent }
          //     children: [
          //       {
          //         path: "users",
          //         loadChildren:
          //           "app/settings/add-details/choose-plan/choose-plan.module#ChoosePlanModule"
          //       }
        ]
        //   }
      }
      // {
      //   path: "users",
      //   component: UserComponent
      // }
    ])
  ],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
