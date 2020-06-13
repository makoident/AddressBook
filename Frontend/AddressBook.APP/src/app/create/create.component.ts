import { Component, OnInit, ViewChild } from '@angular/core';
import { Person } from '../_shared-module/models/person.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationDialogBoxComponent } from '../_shared-module/components/notification-dialog-box/notification-dialog-box.component';
import { PeopleService } from '../_shared-module/services/people.service';
import { ListViewComponent } from '../_shared-module/components/list-view/list-view.component';
import { AlertOnPageComponent, AlertOnPageComponentAlertType } from '../_shared-module/components/alert-on-page/alert-on-page.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  paginationParams = { // these parameters are passed to the child component list-view by using '@Input() paginationParams' method in the list-view component
    pageIndex: 0,
    pageSize: 5,
    orderByIdDesc: true, // we want to order from newest to oldest
    backUrl: '/create' // url of the page to which to navigate back if user clicks on the View icon in the list-view
  }
  person: Person = new Person();
  @ViewChild(ListViewComponent) childListViewComponent: ListViewComponent; // with this we have complete access to the list-view component

  @ViewChild(AlertOnPageComponent) alertOnPage: AlertOnPageComponent;

  constructor(private modalService: NgbModal, private peopleService: PeopleService) { }

  ngOnInit(): void {
    // Set focus to first input box
    let elementReference = document.querySelector('#firstName');
    if (elementReference instanceof HTMLElement) elementReference.focus();
  }

  CreatePerson() {
    const modalRef = this.modalService.open(NotificationDialogBoxComponent, { beforeDismiss: () => false }); // show waiting notification dialog
    modalRef.componentInstance.data = { title: 'Creating person ...', message: '', ShowLoadingAnimation: true }; // set title, subject and the loading animation to the dialog
    this.alertOnPage.Hide(); // hide the alert on page if it's visible

    this.peopleService.CreatePerson(this.person)
      .subscribe(
        (response) => { // success
          modalRef.close(); // close the waiting dialog
          var notificationData = { title: 'Success', message: 'Person successfully created and inserted in the DB.' }; // get the title and subject that will be shown in the notification dialog box
          this.ShowNotification(notificationData, true); // show notification in UI
          this.childListViewComponent.InsertPersonIntoTable(response); // Update the table in the list-view
        },
        (error) => { // error
          modalRef.close(); // close the waiting dialog
          var notificationData = this.peopleService.GetNotificationDataForDialogBox(error); // get the title and subject that will be shown in the notification dialog box
          this.ShowNotification(notificationData, false); // show notification in UI
        });

  }






  /*
   * ************************************ HELPER FUNCTIONS *****************************************************
   * */

  // Shows a notification to the user in the UI
  ShowNotification(notificationData: any, messageOnPageIsSuccess: boolean) {
    if (localStorage.getItem('ShowNotificationsInModalDialogWindows') == '1') {
      this.modalService.open(NotificationDialogBoxComponent).componentInstance.data = notificationData; // show success dialog
    } else {
      var alertType: AlertOnPageComponentAlertType = AlertOnPageComponentAlertType.Success;
      if (messageOnPageIsSuccess == false) alertType = AlertOnPageComponentAlertType.Error;
      this.alertOnPage.Show([notificationData.message], alertType, 5); // show alert on page
    }
  }


}
