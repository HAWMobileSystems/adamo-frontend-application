import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModelLoaderComponent } from "./modelloader.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: "", component: ModelLoaderComponent }
      //     children: [
      //       {
      //         path: "users",
      //         loadChildren:
      //           "app/settings/add-details/choose-plan/choose-plan.module#ChoosePlanModule"
      //       }
      //     ]
      //   }
    ])
  ],
  exports: [RouterModule]
})
export class ModelloaderRoutingModule {}
