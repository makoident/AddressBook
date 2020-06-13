import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PeopleService } from '../_shared-module/services/people.service';
import { NotificationDialogBoxComponent } from '../_shared-module/components/notification-dialog-box/notification-dialog-box.component';
import { Person } from '../_shared-module/models/person.model';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  urlQueryParameters: Params;
  person: Person = new Person();

  ShowLoadingAnimation = true;
  ShowPersonCard: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private peopleService: PeopleService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.urlQueryParameters = params;
    }); // get the url query parameters
    this.GetPersonData(); // Get person's data from the DB and show it on the page
  }





  goBack: boolean = false; // flag used to prevent the showing of error dialog box if user clicks the back button before the http request completes

  GetPersonData() { // is called on ngOnInit to get the person's data and show it in the UI
    this.activatedRoute.params.subscribe(params => {
      const personId = params['id'];

      this.peopleService.GetPerson(personId)
        .subscribe(
          (response) => { // success
            this.person = response;
            this.ShowPersonCard = true;
            this.ShowLoadingAnimation = false;
          },
          (error) => { // error
            if (this.goBack == true) return; // user navigated back to previous page before the data of the person was fetched from the server  -> no need to show him the error notification

            const modalRef = this.modalService.open(NotificationDialogBoxComponent, { beforeDismiss: () => false }); // show error notification dialog
            modalRef.componentInstance.data = this.peopleService.GetNotificationDataForDialogBox(error); // transfer error description to the dialog

            modalRef.result.then((result) => { // ok was clicked in the dialog
              this.btnBackClick(); // go back to the last page
            }, (reason) => { // deletion cancelled
              console.log(`cancelled`);
            });

            this.ShowLoadingAnimation = false;
          })
    });
  }










  btnBackClick() { // happens when the user clicks the back button
    this.goBack = true;
    //console.log(this.urlQueryParameters);
    this.router.navigate([this.urlQueryParameters.backUrl], { queryParams: this.urlQueryParameters }); // go back to the url and add pagination url query parameters so that the list of people gets shown on the correct page
  }




}
