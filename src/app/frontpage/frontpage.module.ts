import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageComponent} from './frontpage.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../services';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageHeaderComponent } from '../components/FrontPageHeaderComponent/frontpage-header.component';
import { SharedModule } from '../shared.module';
import { SharedLazyModule } from '../shared/shared-lazy.module';
import { FrontpageHeaderModule } from '../components/FrontPageHeaderComponent/frontpage-header.module';
// import { FrontPageComponent} from './FrontPageComponent.component';
// import { HeaderComponent} from "../components/HeaderComponent/header.component"

import { TranslateModule } from '@ngx-translate/core';

const authRoutes: Routes = [
  { path: '', component: FrontPageComponent }
]
@NgModule({
  declarations: [ 
    FrontPageComponent ],
  imports: [
    CommonModule, 
    FormsModule,
    FrontpageHeaderModule,
    RouterModule.forChild(authRoutes),
    ReactiveFormsModule,
    SharedModule,
    SharedLazyModule,
  ],
  // providers: [AuthService]
})
export class FrontPageModule { }
