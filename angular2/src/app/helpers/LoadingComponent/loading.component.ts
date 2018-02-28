import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'loading-component',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less']
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input() name: string;
  private isVisible = false;

  constructor(private service: LoadingService) {}

  ngOnInit() {
    if (this.name) {
      this.service.registerInstance(this.name, this);
    }
  }

  ngOnDestroy() {
    if (this.name) {
      this.service.removeInstance(this.name, this);
    }
  }

  hide() {
    this.isVisible = false;
  }

  show() {
    this.isVisible = true;
 } 
}