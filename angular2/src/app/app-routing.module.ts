import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { ModelerComponent } from './modeler/modeler.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: 'front-page', component: FrontPageComponent },
    { path: 'viewer', component: ViewerComponent, canActivate: [AuthGuard] },
    { path: 'modeler', component: ModelerComponent, canActivate: [AuthGuard] },

    { path: '',   redirectTo: '/front-page', pathMatch: 'full' },
    { path: '**', redirectTo: '/front-page', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}