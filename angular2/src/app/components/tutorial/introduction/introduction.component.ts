import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Level } from '../models/Level';
import { LevelService } from '../services/level.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})


export class IntroductionComponent implements OnInit {
  pages: number;
  currentpage: number;
  
  private sub: any;
  levid: number;
  level: Level;

  constructor(private route: ActivatedRoute, private LevServ: LevelService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => this.levid = params['id'])
    this.level = this.LevServ.getLevel(this.levid);
    
    this.pages = this.level.PageDesc.length;
    this.currentpage = 1;

  }
  
  clickNext() {
    if (this.currentpage < this.pages) {
      this.currentpage += 1;
    } else {
      // button.text Introduction abschließen, go to test your knowlege
    }
  }

  clickPrevious() {
    if (this.currentpage > 1) {
      this.currentpage -= 1;
    }
  }

}
