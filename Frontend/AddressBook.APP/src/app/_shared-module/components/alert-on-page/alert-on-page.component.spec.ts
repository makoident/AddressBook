import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertOnPageComponent } from './alert-on-page.component';

describe('AlertOnPageComponent', () => {
  let component: AlertOnPageComponent;
  let fixture: ComponentFixture<AlertOnPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertOnPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertOnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
