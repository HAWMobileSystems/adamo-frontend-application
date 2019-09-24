import { Component, OnInit } from '@angular/core';
import { Level, Helper } from '../../models/level.module';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-test-mc',
  templateUrl: './test-mc.component.html',
  styleUrls: ['./test-mc.component.css']
})
export class TestMCComponent implements OnInit {

  levid: number;
  level: Level;
  questionid: number;
  questions: number;

  constructor(private route: ActivatedRoute, private LevServ: LevelService) { 
    this.level = new Level();
    this.level.PageDesc = new Array;
    this.level.MCTest = new Array;
    this.level.MCTest.push(new Helper<string,string[]>())
    this.questionid = 0;
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.levid = params['id']);
    this.LevServ.getAllLevels().subscribe(
      res => {

        this.level = res[this.levid - 1];


        this.questions = this.level.MCTest.length - 1;
        console.log("Arraylength: " + this.level.MCTest.length);
        console.log("currentQuestID: " + this.questionid);

      }
    )
  }

  CheckCorrectness() {
    if (this.questionid < this.questions) {
      // send http request to check the right answer
      // if correct
      this.questionid += 1;
      // else error wrong answer and tries++

    } else {
      // change button to finish and go back
      // alert with gratulations
    }
    console.log("currentQuestID: " + this.questionid);
  }

}
