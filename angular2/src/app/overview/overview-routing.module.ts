import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview.component";
import { ModelerComponent } from "../ModelerComponent/modeler.component";
import { ModelLoaderComponent } from "../components/ModelLoaderComponent/modelloader.component";

import { Page404Component } from "../page404/page404.component";

const routes: Routes = [
  {
    path: "",
    component: OverviewComponent,
    children: [
      { path: "dashboard", component: ModelLoaderComponent },
      { path: "model/:id/:version", component: ModelerComponent },
      {
        path: "administration",
        loadChildren: () =>
          import(`./../leaves/leaves.module`).then(m => m.LeavesModule)
      },
      {
        path: "tutorial",
        loadChildren: () =>
          import(`./../tutorial/tutorial.module`).then(m => m.TutorialModule)
      },
      // {
      //   path: "settings",
      //   loadChildren: () =>
      //     import(`./../administration/administration.module`).then(
      //       m => m.AdministrationModule
      //     )
      // },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      { path: "**", component: Page404Component }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule {}
