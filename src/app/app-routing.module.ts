import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontPageComponent } from './frontpage/frontpage.component';
import { AuthGuard } from './guards/auth.guard';
import { SimpleModelerComponent } from './ModelerComponent/simplemodeler.component';
const routes: Routes = [
  { path: '', component: FrontPageComponent },

  {
    path: 'overview',
    loadChildren: () => import('./overview/overview.module').then((m) => m.OverviewModule),
    canActivate: [AuthGuard],
  },
  { path: 'ausprobieren', component: SimpleModelerComponent },
  { path: 'de', component: FrontPageComponent },
  { path: 'en', component: FrontPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
