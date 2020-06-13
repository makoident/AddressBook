import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ChangeSetting_ShowNotificationsInModalDialogWindows(e) {
    if (e.target.checked == true) {
      localStorage.setItem('ShowNotificationsInModalDialogWindows', '1');
    } else {
      localStorage.setItem('ShowNotificationsInModalDialogWindows', '0');
    }
  }

  isChecked() {
    if (localStorage.getItem('ShowNotificationsInModalDialogWindows') == '1') {
      return true;
    } else {
      return false;
    }
  }

}
