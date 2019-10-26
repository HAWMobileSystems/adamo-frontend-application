import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview.component";
import { SimpleModelerComponent } from "../ModelerComponent/simplemodeler.component";
import { ModelerComponent } from "../ModelerComponent/modeler.component";
import { ModelLoaderComponent } from "../components/ModelLoaderComponent/modelloader.component";
import { Model } from "../models/model";
import { AdministrationComponent } from "../administration/administration.component";

const overviewRoutes: Routes = [
  {
    path: "",
    component: OverviewComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: "", component: ModelLoaderComponent },
      { path: 'ausprobieren', component: SimpleModelerComponent },
      { path: "model/:id/:version", component: ModelerComponent },
      // { path: "settings", component: AdministrationComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(overviewRoutes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule {}
