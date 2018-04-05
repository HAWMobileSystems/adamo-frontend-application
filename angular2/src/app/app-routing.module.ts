import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { ModelerComponent } from './modeler/modeler.component';
import { AuthGuard } from './guards/auth.guard';
import { TestComponent} from './test/test.component';
import { ModelpermissionComponent } from './modelPermissioManagement/modelpermission.component';
import { RolemanagementComponent} from "./rolemanagement/rolemanagement.component";
import { RolemanagementComponent2} from "./rolemanagement/rolemanagement2.component";
import {UsermanagementComponent} from "./usermanagement/usermanagement.component";
import {Usermanagement2Component} from "./usermanagement/usermanagement2.component";

const routes: Routes = [
    { path: 'front-page', component: FrontPageComponent },
    { path: 'viewer', component: ViewerComponent, canActivate: [AuthGuard] },
    { path: 'modeler', component: ModelerComponent, canActivate: [AuthGuard] },

    { path: 'test', component: TestComponent},
    { path: 'modelPermission', component: ModelpermissionComponent},
    {path: 'roleManagement', component: RolemanagementComponent},
   {path: 'roleManagement2', component: RolemanagementComponent2},
    {path: 'userManagement', component: UsermanagementComponent},
    {path: 'userManagement2', component: Usermanagement2Component},

  // { path: '',   redirectTo: '/front-page', pathMatch: 'full' },
   //{ path: '**', redirectTo: '/front-page', pathMatch: 'full' },

    //{path: '', redirectTo: '/modelPermission', pathMatch: 'full'},
    //{path: '**', redirectTo: '/modelPermission', pathMatch: 'full'},

   //{path: '', redirectTo: '/roleManagement', pathMatch: 'full'},
    //{path: '**', redirectTo: '/roleManagement', pathMatch: 'full'},


   //{path: '', redirectTo: '/roleManagement2', pathMatch: 'full'},
    //{path: '**', redirectTo: '/roleManagement2', pathMatch: 'full'},

    //{ path: '',   redirectTo: '/test', pathMatch: 'full' },
   //{ path: '**', redirectTo: '/test', pathMatch: 'full' },

    {path: '', redirectTo: '/userManagement', pathMatch: 'full'},
    {path: '**', redirectTo: '/userManagement', pathMatch: 'full'},
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}