import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateDialogBoxComponent } from '../update-dialog-box/update-dialog-box.component';
import { DeleteDialogBoxComponent } from '../delete-dialog-box/delete-dialog-box.component';
import { PeopleList, Person } from '../../models/person.model';
import { PeopleService } from '../../services/people.service';
import { NotificationDialogBoxComponent } from '../notification-dialog-box/notification-dialog-box.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertOnPageComponent, AlertOnPageComponentAlertType } from '../alert-on-page/alert-on-page.component';





@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  constructor(private modalService: NgbModal, private peopleService: PeopleService, public peopleList: PeopleList, private activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => { // if pageIndex and pageSize are supplied in url parameters, they will be loaded into the component here
      if (params["pageIndex"]) this.paginationParams.pageIndex = params["pageIndex"];
      if (params["pageSize"]) this.paginationParams.pageSize = params["pageSize"];
    });
    this.PopulateListWithPeople(); // populate list with people
  }







/*
 * ************************************ ALERT-ON-PAGE COMPONENT *****************************************************
 * */

  @ViewChild(AlertOnPageComponent) alertOnPage: AlertOnPageComponent;
  AlertOnPageButton_Click(data: string) { // click on button from alert-on-page component is fired here
    this.PopulateListWithPeople();
  }









  /*
   * ************************************ FILLING THE LIST VIEW WITH PEOPLE *****************************************************
   * */

  @Input() paginationParams = {
    pageIndex: 0,
    pageSize: 5,
    orderByIdDesc: false,
    backUrl: '/view'
  }

  ShowLoadingAnimation: boolean = false;
  ShowTable: boolean = true;
  @Input() IsTableInSearchMode: boolean = false;
  public PopulateListWithPeople() {
    if (this.IsTableInSearchMode) return; // in search mode the table is populate from the parent component search.component.ts

    this.ShowLoadingAnimation = true;
    this.ShowTable = true;
    setTimeout(() => { this.alertOnPage.Hide(); }); // hide alerts on the UI

    this.peopleService.GetPeople(this.paginationParams.pageIndex, this.paginationParams.pageSize, this.paginationParams.orderByIdDesc)
      .subscribe(
        (response) => { // success -> populate list with people!
          if (response.totalCount > 0) this.peopleList = response;
          if (response.totalCount == 0) {
            this.peopleList = new PeopleList();
            this.ShowTable = false; // hide the list view
            this.alertOnPage.Show(["Address book is empty. Create new people so they will get added to the address book."], AlertOnPageComponentAlertType.Neutral, 0, "Create people ...", "", "/create"); // show alert on page
          }
          this.ShowLoadingAnimation = false;
        },
        (error) => { // error
          this.ShowErrorNotification(error);
          this.ShowLoadingAnimation = false;
          this.ShowTable = false;
          setTimeout(() => { this.alertOnPage.Show(["Could not get people from the database."], AlertOnPageComponentAlertType.Error, 0, "Retry"); }); // must be called in setTimeout to avoid the error 'Expression has changed after it was checked'. more on https://blog.angular-university.io/angular-debugging/
        })
  }

/*
 * ************************************ PAGINATION *****************************************************
 * */

  PageNumberChanged(pageEvent) {
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.pageIndex = pageEvent.pageIndex;
    this.PopulateListWithPeople();
  }
  













/*
 * ************************************ DELETING *****************************************************
 * */

  OpenDeleteDialog(person: Person) {
    const modalRef = this.modalService.open(DeleteDialogBoxComponent, { beforeDismiss: () => !modalRef.componentInstance.ShowLoadingAnimation }); // show deletion confirmation dialog
    modalRef.componentInstance.person = person; // transfer data of person for deletion to the dialog

    modalRef.result.then((result) => { // deletion was confirmed
      if (result == 'deleted') { // deletion was successfull
        if (this.IsTableInSearchMode == true) { // table is in search mode -> pagination is disabled in search mode, thus we can just remove the person from from the table without making a sync with the DB on the web API
          this.peopleList.people = this.peopleList.people.filter((value, key) => { return value.id != person.id; }); // remove deleted person from the list
          this.peopleList.totalCount--;
        } else { // table is in normal mode
          /* NOTE: same implementation as when the table is in search mode is possible, but the table with people goes out of sync with the pagination. To resync the table, instead of above
           * 2 lines of code, a call to this.PopulateListWithPeople() is needed, which I implemented below. Disadvantage is that it creates more load on web API because of more requests for table resyncing.
           * Solution for not creating more load on web API is to cache also results from the next page, so the table will not need to be resynced with web API, but from results from the cache */

          if (this.peopleList.people.length == 1 && this.paginationParams.pageIndex > 0) { // only one person is visible in the table -> we need to set the pageIndex so when table is refreshed, correct table page will be shown to the user
            var totalPages = Math.ceil(this.peopleList.totalCount / this.paginationParams.pageSize);
            if (this.paginationParams.pageIndex == totalPages - 1) { // the last page is shown in the table -> refresh the list with people
              this.paginationParams.pageIndex--;
            }
          }
          this.PopulateListWithPeople(); // refresh the list
        }
        this.ShowSuccessNotification('Deletion successful!'); // show notification in the UI

      } else { // error on deletion
        this.ShowErrorNotification(result);
      }
    }, (reason) => { // deletion cancelled
      console.log(`cancelled`);
    });
  }














/*
 * ************************************ UPDATING *****************************************************
 * */

  UpdateEditDialog(person: Person) {
    const modalRef = this.modalService.open(UpdateDialogBoxComponent, { beforeDismiss: () => !modalRef.componentInstance.ShowLoadingAnimation }); // show update dialog
    modalRef.componentInstance.person = new Person(person.firstName, person.lastName, person.address, person.telephoneNumber, person.id); // transfer data of person to the dialog

    modalRef.result.then((result) => { // update was confirmed
      if (result.result == 'updated') { // update was successfull
        person.firstName = result.person.firstName;
        person.lastName = result.person.lastName;
        person.address = result.person.address;
        person.telephoneNumber = result.person.telephoneNumber;
        
        this.ShowSuccessNotification('Update successful!'); // show notification in the UI

      } else { // error on update
        this.ShowErrorNotification(result.error);
      }
    }, (reason) => { // update cancelled
      console.log(`cancelled`);
    });

  }








/*
* ************************************ INSERTING *****************************************************
* */

  // This function is called from the parent component create.component.ts
  InsertPersonIntoTable(person: Person) {
    if (this.paginationParams.pageIndex > 0) { // the first page is NOT shown in the list of people -> we need to fetch the first page from the DB in order to show the inserted person at the beginning of the list
      this.paginationParams.pageIndex = 0;
      this.PopulateListWithPeople(); // fetch
      return;
    }
    // we don't need to fetch the first page from the DB because it's already shown in the table

    //this.MessageOnPage = ""; // hide the message on page
    this.alertOnPage.Hide();

    if (this.peopleList.totalCount == 0) { // the table currently contains no persons -> add the person to the table and show the table
      this.peopleList.people.push(person);
      this.ShowTable = true;
    } else { // the table contains one or more persons
      this.peopleList.people.splice(0, 0, person); // insert person at the top of the table
      if (this.peopleList.people.length > this.paginationParams.pageSize) {
        this.peopleList.people.splice(-1, 1); // remove person at the bottom of the table
      }
    }
    
    this.peopleList.totalCount++; // increase the total count of persons in the table
  }







/*
 * ************************************ HELPER FUNCTIONS *****************************************************
 * */
  
  // Shows notification dialog box about arised error
  ShowErrorNotification(error: any) {
    var notificationData = this.peopleService.GetNotificationDataForDialogBox(error); // get the title and subject that will be shown in the notification dialog box
    if (localStorage.getItem('ShowNotificationsInModalDialogWindows') == '1') {
      this.modalService.open(NotificationDialogBoxComponent).componentInstance.data = notificationData; // show the notification dialog box
    } else {
      setTimeout(() => { this.alertOnPage.Show([notificationData.message], AlertOnPageComponentAlertType.Error, 5); }); // must be called in setTimeout to avoid the error 'Expression has changed after it was checked'. more on https://blog.angular-university.io/angular-debugging/
    }
  }
 
  // Shows a success dialog box
  ShowSuccessNotification(msg: string) {
    var notificationData = { title: 'Success', message: msg };
    if (localStorage.getItem('ShowNotificationsInModalDialogWindows') == '1') {
      this.modalService.open(NotificationDialogBoxComponent).componentInstance.data = notificationData; // show success dialog
    } else {
      this.alertOnPage.Show([notificationData.message], AlertOnPageComponentAlertType.Success, 5)
    }
  }
  

}
