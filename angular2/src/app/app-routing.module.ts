import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewerComponent } from "./viewer/viewer.component";
import { FrontPageComponent } from "./frontpage/frontpage.component";
import { AuthGuard } from "./guards/auth.guard";
import { OverviewComponent } from "./overview/overview.component";
import { ModelerComponent } from "./ModelerComponent/modeler.component";
import { SimpleModelerComponent } from "./ModelerComponent/simplemodeler.component";

const routes: Routes = [
  // {
  //   path: "compose",
  //   component: ComposeMessageComponent,
  //   outlet: "popup"
  // },
  // {
  //   path: "admin",
  //   loadChildren: () =>
  //     import("./admin/admin.module").then(mod => mod.AdminModule)
  //   // canLoad: [AuthGuard]
  // },
  {
    path: "overview",
    loadChildren: () =>
      import("./overview/overview.module").then(
                  mod => mod.OverviewModule
      ),
    // data: { preload: true }
  },
  // { path: "", redirectTo: "/", pathMatch: "full" }
  { path: "", component: FrontPageComponent },
  { path: "de", component: FrontPageComponent },
  { path: "en", component: FrontPageComponent },
  
  { path: 'ausprobieren', component: SimpleModelerComponent },
  // { path: '**', component: PageNotFoundComponent }
  //   path: "overview",
  //   component: OverviewComponent,
  //   children: [
  //     {
  //       path: "",
  //       loadChildren: () =>
  //         import("./components/ModelLoaderComponent/modelloader.module").then(
  //           mod => mod.ModelloaderModule
  //         )
  //     }
  //   ]
  // },
  // { path: "viewer", component: ViewerComponent, canActivate: [AuthGuard] },
  // { path: "overview", component: OverviewComponent },
  // { path: "modeler", loadChildren: () => import('./overview/overview.module').then(mod => mod.OverviewModule)},
  // { path: "modeler", loadChildren: './overview/overview.module#OverviewModule'},
  // { path: "modeler", component: ModelerComponent },
  // {

  //   path: "administration",
  //   component: AdministrationComponent,
  // },

  // { path: "", redirectTo: "", pathMatch: "full" },
  // { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
