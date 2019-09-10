import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewerComponent } from "./viewer/viewer.component";
import { FrontPageComponent } from "./frontpage/frontpage.component";
import { AuthGuard } from "./guards/auth.guard";
import { OverviewComponent } from "./overview/overview.component";
import { ModelerComponent } from "./ModelerComponent/modeler.component";
import { TutorialRoutes } from "./components/tutorial/tutorial-routing.module"

const routes: Routes = [
  { path: "front-page", component: FrontPageComponent },
  { path: "viewer", component: ViewerComponent, canActivate: [AuthGuard] },
  { path: "overview", component: OverviewComponent },
  { path: "modeler", component: ModelerComponent },
  { path: 'tutorial', children: TutorialRoutes },
  // {
  //   path: "administration",
  //   component: AdministrationComponent,
  // },

  { path: "", redirectTo: "/front-page", pathMatch: "full" },
  { path: "**", redirectTo: "/front-page", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
