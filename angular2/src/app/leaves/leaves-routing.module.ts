//leaves-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplyComponent } from './apply/apply.component';
import { LeavesComponent } from './leaves.component';
import { Page404leavesComponent } from './page404leaves/page404leaves.component';
import { UserComponent } from './UserComponent/user.component';
import { ModelComponent } from '../components/ModelComponent/model.component';
import { RoleComponent } from './RoleComponent/role.component';
import { PermissionComponent } from './PermissionComponent/permission.component';


const routes: Routes = [
  {
    path: '', component: LeavesComponent, children: [
      {
        path: 'user', component: UserComponent
      },
      {
        path: 'model', component: ModelComponent
      },
      {
        path: 'role', component: RoleComponent
      },
      {
        path: 'permission', component: PermissionComponent
      },

      // {
      //   path: 'apply', component: ApplyComponent
      // },
      // { path: 'balance', loadChildren: () => import(`./balance/balance.module`).then(m => m.BalanceModule) },
      {
        path: '', redirectTo: 'user', pathMatch: 'full'
      },
      { path: '**', component: Page404leavesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
