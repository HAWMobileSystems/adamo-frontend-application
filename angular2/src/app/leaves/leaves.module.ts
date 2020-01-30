//leaves.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesComponent } from './leaves.component';
import { ApplyComponent } from './apply/apply.component';
import { Page404leavesComponent } from './page404leaves/page404leaves.component';
import { UserComponent } from './UserComponent/user.component';
import { SharedModule } from '../shared.module';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PermissionComponent } from './PermissionComponent/permission.component';
import { RoleComponent } from './RoleComponent/role.component';
import { ProfileComponent } from './ProfileComponent/profile.component';
import { ModelComponent } from '../components/ModelComponent/model.component';
// import { BuTabsModule } from 'angular2-bulma';

@NgModule({
  declarations: [
    ApplyComponent,
    LeavesComponent,
    UserComponent,
    ModelComponent,
    PermissionComponent,
    RoleComponent,
    ProfileComponent,
    Page404leavesComponent
  ],
  imports: [
    // BuTabsModule,
    CommonModule,
    SharedModule,
    FormsModule,
    Ng2SearchPipeModule,
    LeavesRoutingModule,
  ]
})
export class LeavesModule { }
