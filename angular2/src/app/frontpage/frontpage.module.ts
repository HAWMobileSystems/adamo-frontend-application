import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageComponent} from './frontpage.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../services';
import { RouterModule, Routes } from '@angular/router';
// import { FrontPageComponent} from './FrontPageComponent.component';
// import { HeaderComponent} from "../components/HeaderComponent/header.component"


const authRoutes: Routes = [
  { path: '', component: FrontPageComponent }
]
@NgModule({
  declarations: [ FrontPageComponent ],
  imports: [
    CommonModule, 
    FormsModule,
    
    RouterModule.forChild(authRoutes),
    ReactiveFormsModule
  ],
  // providers: [AuthService]
})
export class FrontPageModule { }
