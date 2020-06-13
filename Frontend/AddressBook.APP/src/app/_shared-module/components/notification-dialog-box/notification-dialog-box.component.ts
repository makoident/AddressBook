import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification-dialog-box',
  templateUrl: './notification-dialog-box.component.html',
  styleUrls: ['./notification-dialog-box.component.css']
})
export class NotificationDialogBoxComponent implements OnInit {
  @Input() data;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  @ViewChild('btnOk') btnFocus: ElementRef; // Set focus to button after dialog loads
  ngAfterViewInit() {
    if (typeof this.btnFocus != 'undefined') setTimeout(() => this.btnFocus.nativeElement.focus());
  }

}
