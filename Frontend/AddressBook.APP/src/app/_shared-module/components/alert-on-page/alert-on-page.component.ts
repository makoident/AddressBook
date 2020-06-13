import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

export enum AlertOnPageComponentAlertType {
  Success = "success",
  Error = "danger",
  Neutral = "primary",
  Gray = "secondary"
}

@Component({
  selector: 'app-alert-on-page',
  templateUrl: './alert-on-page.component.html',
  styleUrls: ['./alert-on-page.component.css']
})
export class AlertOnPageComponent implements OnInit {
  public AlertTypes: AlertOnPageComponentAlertType;
  Visible: boolean = false;
  Class: string = AlertOnPageComponentAlertType.Neutral;
  Messages: string[] = [];
  ButtonText: string = "";
  ButtonDataToEmit: string = "";
  ButtonRedirectToUrl: string = "";
  timeout: any; // will hold reference to the function for hiding the alert on page the setTimeout expires

  @Output() emitBtnOkClick = new EventEmitter<string>();

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  btnClicked(data: string) { // happens on click of the button
    this.emitBtnOkClick.emit(data) // emit the click event with data to the parent
  }

  Show(Messages: string[], Type: AlertOnPageComponentAlertType, AutoHideAfterNSeconds: number = 0, ButtonText: string = "", ButtonDataToEmit: string = "", ButtonRedirectToUrl: string = "") {
    this.Messages.splice(0, 0, ...Messages); // insert the messages
    this.Class = Type;
    this.ButtonText = ButtonText;
    this.ButtonDataToEmit = ButtonDataToEmit;
    this.ButtonRedirectToUrl = ButtonRedirectToUrl;
    this.Visible = true; // show the alert

    clearTimeout(this.timeout); // remove any previous timeouts for hiding the alert so the alert does not get hidden
    if (AutoHideAfterNSeconds > 0) {
      this.timeout = setTimeout(() => {
        this.Hide(); // hide the message on page
      }, AutoHideAfterNSeconds * 1000);
    }
  }

  Hide() {
    clearTimeout(this.timeout); // remove any previous timeouts for hiding the alert
    this.Visible = false; // hide the message on page
    this.Messages = []; // clear all messages
  }
}
