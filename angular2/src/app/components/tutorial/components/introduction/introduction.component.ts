import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Level, Helper } from '../../models/level.module';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})


export class IntroductionComponent implements OnInit {

  private currentpage: number;
  private levid: number;

  public level: Level;

  constructor(private route: ActivatedRoute, private LevServ: LevelService) {

    this.level = new Level();
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.levid = params['id']);
    this.LevServ.getAllLevels().subscribe(
      res => {
        this.level = res[this.levid - 1];
        this.currentpage = 1;

      }
    )
  }

  clickNext() {
    if (this.currentpage < this.level.PageDesc.length) {
      this.currentpage += 1;
    } else {

      /* Todo
      * Alert, Intro abschließen, Safe and return, Test your knowlege, Go Back
      */
    }
    if (this.currentpage == this.level.PageDesc.length) {
      document.getElementById("btnNext").textContent = "Safe and Return";
    }
  }

  clickPrevious() {
    console.log("previous clicked" + " - " + "currentpage: " + this.currentpage + " - pages: " + this.level.PageDesc.length);
    if(this.currentpage == this.level.PageDesc.length) {
      document.getElementById("btnNext").textContent = "Next";
    }
    if (this.currentpage > 1) {
      this.currentpage -= 1;
    }
  }

}
