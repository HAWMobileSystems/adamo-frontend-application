import { TutorialComponent } from './tutorial.component';
import { TutorialViewComponent } from './components/tutorialview/tutorialview.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { TestMCComponent } from './components/test-mc/test-mc.component';
import { TestModComponent } from './components/test-mod/test-mod.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [{
    path: '', component: TutorialComponent,
    children: [
        { path: 'start', component: TutorialViewComponent },
        { path: 'intro/:cat/:id', component: IntroductionComponent },
        { path: 'testmc/:cat', component: TestMCComponent },
        { path: 'testmod/:cat/:id', component: TestModComponent },

        { path: '', redirectTo: 'start', pathMatch: 'full' },
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TutorialRoutingModule { }
  