import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedPhrasesComponent } from './tracked-phrases.component';

describe('TrackedPhrasesComponent', () => {
  let component: TrackedPhrasesComponent;
  let fixture: ComponentFixture<TrackedPhrasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackedPhrasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackedPhrasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
