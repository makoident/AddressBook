import { HttpParams } from "@angular/common/http";

// This model is used for fetching a person's details from the server
export class Person {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  telephoneNumber: string;

  constructor(_firstName?: string, _lastName?: string, _address?: string, _telephoneNumber?: string, _id?: number) {
    this.firstName = _firstName ? _firstName : "";
    this.lastName = _lastName ? _lastName : "";
    this.address = _address ? _address : "";
    this.telephoneNumber = _telephoneNumber ? _telephoneNumber : "";
    if (_id) this.id = _id;
  }

  public ConvertToHttpParams(pageIndex: number, pageSize: number) {
    return {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('firstName', this.firstName)
        .set('lastName', this.lastName)
        .set('address', this.address)
        .set('telephoneNumber', this.telephoneNumber)
    }
  }

}

// This model is used for fetching a list of people's details from the server
export class PeopleList {
  people: Person[];
  totalCount: number;

  constructor() {
    this.people = new Array<Person>();
    this.totalCount = 0;
  }
}
