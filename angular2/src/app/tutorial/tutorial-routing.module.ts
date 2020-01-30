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
        { path: '', redirectTo: 'start', pathMatch: 'full' },
        { path: 'start', component: TutorialViewComponent },
        { path: 'introduction/:id', component: IntroductionComponent },
        { path: 'testmc/:id', component: TestMCComponent },
        { path: 'testmod', component: TestModComponent },
        
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TutorialRoutingModule { }
  