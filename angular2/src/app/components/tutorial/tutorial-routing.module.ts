import { TutorialComponent } from './tutorial.component';
import { TutorialViewComponent } from './tutorialview/tutorialview.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { TestMCComponent } from './test-mc/test-mc.component';
import { TestModComponent } from './test-mod/test-mod.component';


export const TutorialRoutes = [{
    path: '', component: TutorialComponent,
    children: [
        { path: '', redirectTo: 'start', pathMatch: 'full' },
        { path: 'start', component: TutorialViewComponent },
        { path: 'introduction', component: IntroductionComponent },
        { path: 'testmc', component: TestMCComponent },
        { path: 'testmod', component: TestModComponent },
        
    ]
}]

export const TutorialRoutingModule = []