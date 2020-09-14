import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TutorialRoutingModule } from './tutorial-routing.module';
import { FormsModule } from '@angular/forms'

import { MatExpansionModule } from '@angular/material/expansion';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizableModule } from 'angular-resizable-element';
import { AngularSplitModule } from 'angular-split';

import { TutorialComponent } from './tutorial.component'
import { IntroductionComponent } from './components/introduction/introduction.component';
import { TutorialViewComponent } from './components/tutorialview/tutorialview.component';
import { TestMCComponent } from './components/test-mc/test-mc.component';
import { TestModComponent } from './components/test-mod/test-mod.component';
import { LanguageComponent } from './components/language/language.component'
import { SharedModule } from '../../shared.module';
import { LevelService } from './services/level.service';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { LanguageService } from './services/language.service';
import { MatCardModule } from '@angular/material/card';
// import { ModelerComponent } from '../../ModelerComponent/modeler.component';

@NgModule({
  declarations: [
    IntroductionComponent,
    TutorialViewComponent,
    TestMCComponent,
    TestModComponent,
    TutorialComponent,
    SafeHtmlPipe,
    LanguageComponent
    // ModelerComponent
  ],
  imports: [

    CommonModule,
    RouterModule,
    MatExpansionModule,
    FormsModule,
    //BrowserAnimationsModule,
    ResizableModule,
    AngularSplitModule,
    TutorialRoutingModule,
    SharedModule,
    MatCardModule,
  ],
  providers: [
    LevelService,
    LanguageService
  ]
})

export class TutorialModule {}
