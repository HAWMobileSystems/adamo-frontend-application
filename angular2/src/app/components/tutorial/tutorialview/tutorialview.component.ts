import { Component, OnInit, Output } from '@angular/core';
import { Level } from '../models/Level';
import { LevelService } from '../services/level.service';

@Component({
  selector: 'app-tutorialview',
  templateUrl: './tutorialview.component.html',
  styleUrls: ['./tutorialview.component.css']
})
export class TutorialViewComponent implements OnInit {

  levels: Level[];

  constructor(LevServ: LevelService) {
    this.levels = LevServ.getLevels();
  }

  ngOnInit() {
  }

}
