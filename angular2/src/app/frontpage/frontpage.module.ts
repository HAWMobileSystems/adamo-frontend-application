import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageComponent} from './frontpage.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../services';
// import { FrontPageComponent} from './FrontPageComponent.component';
// import { HeaderComponent} from "../components/HeaderComponent/header.component"

@NgModule({
  declarations: [ FrontPageComponent ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService]
})
export class FrontPageModule { }
