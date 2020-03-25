import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMCComponent } from './test-mc.component';

describe('TestMCComponent', () => {
  let component: TestMCComponent;
  let fixture: ComponentFixture<TestMCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
