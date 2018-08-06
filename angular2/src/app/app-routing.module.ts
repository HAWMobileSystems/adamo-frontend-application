import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewerComponent} from './viewer/viewer.component';
import {FrontPageComponent} from './front-page/front-page.component';
//import {ModelerComponent} from './modeler/modeler.component';
import {AuthGuard} from './guards/auth.guard';
import {TestComponent} from './test/test.component';
import {ModellerPageComponent} from './modellerPage/modellerPage.component';
import {ModelpermissionComponent} from './modelPermissioManagement/modelpermission.component';
import {RolemanagementComponent} from './rolemanagement/rolemanagement.component';
import {RolemanagementComponent2} from './rolemanagement/rolemanagement2.component';
import {UsermanagementComponent} from './usermanagement/usermanagement.component';
import {Usermanagement2Component} from './usermanagement/usermanagement2.component';
import {AdministrationPageComponent} from './administration-page/administration-page.component';
//import {Exp_frontpageComponent} from "./exp_frontpage/exp_frontpage.component";

const routes: Routes = [
    {path: 'front-page', component: FrontPageComponent},
    {path: 'viewer', component: ViewerComponent, canActivate: [AuthGuard]},
   /// {path: 'modellerPage', component: ModelerComponent, canActivate: [AuthGuard]},

    {path: 'test', component: TestComponent},
    {path: 'modeler', component: ModellerPageComponent},
    {path: 'modelPermission', component: ModelpermissionComponent},
    {path: 'roleManagement', component: RolemanagementComponent},
    {path: 'roleManagement2', component: RolemanagementComponent2},
    {path: 'userManagement', component: UsermanagementComponent},
    {path: 'userManagement2', component: Usermanagement2Component},
    {path: 'administration-page', component: AdministrationPageComponent},
    //{path: 'expFrontpage' , component: Exp_frontpageComponent},

    {path: '', redirectTo: '/front-page', pathMatch: 'full'},
    {path: '**', redirectTo: '/front-page', pathMatch: 'full'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}