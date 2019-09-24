import { Component, OnInit, Output } from '@angular/core';
import { Level } from '../../models/level.module';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-tutorialview',
  templateUrl: './tutorialview.component.html',
  styleUrls: ['./tutorialview.component.css']
})
export class TutorialViewComponent implements OnInit {

  public levels: Level[];

  constructor(private LevServ: LevelService) {

  }

  ngOnInit() {
    this.LevServ.getAllLevels().subscribe(levels => this.levels = levels);
  }


}
