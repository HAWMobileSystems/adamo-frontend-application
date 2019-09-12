import { Component, OnInit } from '@angular/core';
import { Level } from '../models/Level';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from '../services/level.service';

@Component({
  selector: 'app-test-mc',
  templateUrl: './test-mc.component.html',
  styleUrls: ['./test-mc.component.css']
})
export class TestMCComponent implements OnInit {

  private sub: any;
  levid: number;
  level: Level;
  questionid: number;
  questions: number;

  constructor(private route: ActivatedRoute, private LevServ: LevelService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => this.levid = params['id']);
    this.level = this.LevServ.getLevel(this.levid);

    this.questions = this.level.MCTest.length - 1;
    this.questionid = 0;
    console.log("Arraylength: " + this.level.MCTest.length);
    console.log("currentQuestID: " + this.questionid);

  }

  CheckCorrectness() {
    // send http request to check the right answer
    // if correct
    if (this.questionid < this.questions){
      this.questionid += 1;
    } else {

    }
    // else error wrong answer and tries++
    console.log("currentQuestID: " + this.questionid);
  }

}
