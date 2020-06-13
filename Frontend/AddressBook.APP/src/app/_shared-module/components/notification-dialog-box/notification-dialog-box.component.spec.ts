import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDialogBoxComponent } from './notification-dialog-box.component';

describe('NotificationDialogBoxComponent', () => {
  let component: NotificationDialogBoxComponent;
  let fixture: ComponentFixture<NotificationDialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationDialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
