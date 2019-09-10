import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TutorialRoutingModule } from './tutorial-routing.module';

import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizableModule } from 'angular-resizable-element';
import { AngularSplitModule } from 'angular-split';

import { TutorialComponent } from './tutorial.component'
import { IntroductionComponent } from './introduction/introduction.component';
import { TutorialViewComponent } from './tutorialview/tutorialview.component';
import { TestMCComponent } from './test-mc/test-mc.component';
import { TestModComponent } from './test-mod/test-mod.component';
import { SharedModule } from '../../shared.module';
// import { ModelerComponent } from '../../ModelerComponent/modeler.component';

@NgModule({
  declarations: [
    IntroductionComponent,
    TutorialViewComponent,
    TestMCComponent,
    TestModComponent,
    TutorialComponent, 
    // ModelerComponent
  ],
  imports: [
    RouterModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    ResizableModule,
    AngularSplitModule,
    TutorialRoutingModule, 
    SharedModule
  ]
})

export class TutorialModule {}
