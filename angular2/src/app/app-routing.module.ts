import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { RegisterComponent } from './register/register.component';
import { ModelerComponent } from './modeler/modeler.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/front-page', pathMatch: 'full' },
    { path: 'front-page', component: FrontPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'viewer', component: ViewerComponent, canActivate: [AuthGuard] },
    { path: 'modeler', component: ModelerComponent, canActivate: [AuthGuard] },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }