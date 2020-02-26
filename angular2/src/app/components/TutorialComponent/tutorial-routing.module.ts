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
        { path: 'start/', redirectTo: 'start/:lang' },
        { path: 'start/:lang', component: TutorialViewComponent },
        // intro/en/Beginner/1
        { path: 'intro/:lang/:cat/:id', component: IntroductionComponent },
        { path: 'multiplechoice/:lang/:cat', component: TestMCComponent },
        { path: 'modelling/:lang/:cat/:id', component: TestModComponent },

        { path: '', redirectTo: 'start/', pathMatch: 'full' },
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TutorialRoutingModule { }
  