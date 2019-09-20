import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestModComponent } from './test-mod.component';

describe('TestModComponent', () => {
  let component: TestModComponent;
  let fixture: ComponentFixture<TestModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
