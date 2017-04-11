import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaTimesComponent } from './la-times.component';

describe('LaTimesComponent', () => {
  let component: LaTimesComponent;
  let fixture: ComponentFixture<LaTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
