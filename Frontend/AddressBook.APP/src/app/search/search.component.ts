import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person, PeopleList } from '../_shared-module/models/person.model';
import { ListViewComponent } from '../_shared-module/components/list-view/list-view.component';
import { PeopleService } from '../_shared-module/services/people.service';
import { NotificationDialogBoxComponent } from '../_shared-module/components/notification-dialog-box/notification-dialog-box.component';
import { AlertOnPageComponent, AlertOnPageComponentAlertType } from '../_shared-module/components/alert-on-page/alert-on-page.component';

/*enum SearchResult {
  NotFound = 0,
  Found = 1,
  Other = -1
}*/

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  paginationParams = { // these parameters are passed to the child component list-view by using '@Input() paginationParams' method in the list-view component
    pageIndex: 0,
    pageSize: 20,
    orderByIdDesc: true, // we want to order from newest to oldest
    backUrl: '/search' // url of the page to which to navigate back if user clicks on the View icon in the list-view
  }
  IsTableInSearchMode: boolean = true; // this is passed to the list-view.componenet to prevent the automatic refreshing of the table in list-view component
  person: Person = new Person();
  @ViewChild(ListViewComponent) childListViewComponent: ListViewComponent; // with this we have complete access to the list-view component

  @ViewChild(AlertOnPageComponent) alertOnPage: AlertOnPageComponent; // alert notification component for UI

  constructor(private modalService: NgbModal, private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.NewSearch(); // Set focus to first input box and do other work to set the UI for a new search
  }

  SearchForPeople() { // happens when user clicks the Search button
    this.alertOnPage.Hide(); // hide and clear any previous alert messages shown

    const modalRef = this.modalService.open(NotificationDialogBoxComponent, { beforeDismiss: () => false }); // show waiting notification dialog
    modalRef.componentInstance.data = { title: 'Searching for person ...', message: '', ShowLoadingAnimation: true }; // set title, subject and the loading animation to the dialog
    this.alertOnPage.Hide(); // hide the alert on the page if visible

    this.peopleService.SearchForPeople(this.paginationParams.pageIndex, this.paginationParams.pageSize, this.person)
      .subscribe(
        (response) => { // success
          modalRef.close(); // close the waiting dialog
          if (response.totalCount > 0) { // show the Found notification
            this.alertOnPage.Show(["Below are your search results ordered by First name, Last name, Address, Telephone number. A maximum of " + this.paginationParams.pageSize + " results are shown in the below table. If the person you're searching for is not listed in the below table, try searching again by narrowing your search criterias."], AlertOnPageComponentAlertType.Neutral); // show alert on page
          } else { // show the not found notification
            this.alertOnPage.Show(["No people can be found matching the entered search criterias. Try entering different search criterias."], AlertOnPageComponentAlertType.Gray); // show alert on page
          }
          this.childListViewComponent.peopleList = response; // Update the table in the list-view
        },
        (error) => { // error
          modalRef.close(); // close the waiting dialog
          this.ShowNotification(error);
        });
  }

  ClearSearch() { // happens when user clicks the New search button
    this.childListViewComponent.peopleList = new PeopleList();
    this.childListViewComponent.alertOnPage.Hide();
    this.NewSearch();
  }

  // Sets focus to first input box and does other work to set the UI for a new search
  NewSearch() {
    let elementReference = document.querySelector('#firstName');
    if (elementReference instanceof HTMLElement) elementReference.focus();

    setTimeout(() => { this.alertOnPage.Hide(); }); // must be inside setTimeout , see https://blog.angular-university.io/angular-debugging/
    this.person = new Person();
  }












  /*
   * ************************************ HELPER FUNCTIONS *****************************************************
   * */

  // Shows a notification to the user in the client
  ShowNotification(error: any) {
    var notificationData = this.peopleService.GetNotificationDataForDialogBox(error); // get the title and subject that will be shown in the notification dialog box
    if (localStorage.getItem('ShowNotificationsInModalDialogWindows') == '1') {
      this.modalService.open(NotificationDialogBoxComponent).componentInstance.data = notificationData; // show the notification dialog box with error
    } else {
      this.alertOnPage.Show([notificationData.message], AlertOnPageComponentAlertType.Error, 5); // show alert on page
    }
  }






}
