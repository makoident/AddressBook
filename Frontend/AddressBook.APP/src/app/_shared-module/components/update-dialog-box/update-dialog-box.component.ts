import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../../models/person.model';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-edit-dialog-box',
  templateUrl: './update-dialog-box.component.html',
  styleUrls: ['./update-dialog-box.component.css']
})
export class UpdateDialogBoxComponent implements OnInit {
  ShowLoadingAnimation = false;
  firstName: string;
  lastName: string;
  @Input() person: Person; // variable holding the data of the person that needs to be updated

  constructor(public dialog: NgbActiveModal, private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.firstName = this.person.firstName;
    this.lastName = this.person.lastName;
  }

  UpdatePerson() { // called when user clicks on the Ok button in the edit dialog
    this.ShowLoadingAnimation = true;

    this.peopleService.UpdatePerson(this.person)
      .subscribe(
        (response) => { // success
          this.dialog.close({ result: 'updated', person: this.person });
        },
        (error) => { // error
          this.dialog.close({ result: 'error', error: error });
        })
  }



}
