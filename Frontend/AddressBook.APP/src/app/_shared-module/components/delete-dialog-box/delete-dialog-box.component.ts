import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../../models/person.model';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-delete-dialog-box',
  templateUrl: './delete-dialog-box.component.html',
  styleUrls: ['./delete-dialog-box.component.css']
})
export class DeleteDialogBoxComponent implements OnInit {
  ShowLoadingAnimation = false;
  @Input() person: Person; // variable holding the data of the person that needs to be deleted

  constructor(public dialog: NgbActiveModal, private peopleService: PeopleService) { }

  ngOnInit(): void {
  }
  
  @ViewChild('btnCancel') btnFocus: ElementRef; // Set focus to button after dialog loads
  ngAfterViewInit() {
    setTimeout(() => this.btnFocus.nativeElement.focus());
  }

  DeletePerson() {
    this.ShowLoadingAnimation = true;

    this.peopleService.DeletePerson(this.person.id)
      .subscribe(
        (response) => { // success
          this.dialog.close('deleted');
        },
        (error) => { // error
          this.dialog.close(error);
        })
        
  }
}
