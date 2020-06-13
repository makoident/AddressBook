/* *************************************** 
 * *******  BUSINESS LOGIC LAYER *********
 * *************************************** */

using AddressBook.BOL;
using System;
using System.Collections.Generic;
using System.Text;

namespace AddressBook.BLL
{



    /* ****************************************************************************************************************************************** 
     * ********************************************** VALIDATIONS CLASS FOR THE BS **************************************************************
     * ****************************************************************************************************************************************** */

    public class PersonValidator : IPersonValidator
    {
        private PeopleBs peopleBs;

        public PersonValidator()
        {

        }

        public void LoadPerson(PeopleBs peopleBs)
        {
            this.peopleBs = peopleBs;
        }


        public bool ValidatePersonData(Person person, bool telephoneNumberMustBeUnique = false, bool allFieldsRequired = false, int excludePersonId = -1)
        {
            //peopleBs.Errors.Add("aa");

            // Is person data valid?
            if (this.IsStringInValidFormat(person.FirstName, 50) == false) return false;
            if (this.IsStringInValidFormat(person.LastName, 50) == false) return false;
            if (this.IsStringInValidFormat(person.Address, 100) == false) return false;
            if (this.IsStringInValidFormat(person.TelephoneNumber, 50) == false) return false;

            // Is at least one field data entered?
            if (string.IsNullOrWhiteSpace(person.FirstName) == true && string.IsNullOrWhiteSpace(person.LastName) == true && string.IsNullOrWhiteSpace(person.Address) == true && string.IsNullOrWhiteSpace(person.TelephoneNumber) == true)
            {
                peopleBs.Errors.Add("Enter data in at least one field.");
                return false;
            }

            // Must all person data be entered?
            if (allFieldsRequired == true) // all person data must be entered
            {
                if (string.IsNullOrWhiteSpace(person.FirstName) || string.IsNullOrWhiteSpace(person.LastName) || string.IsNullOrWhiteSpace(person.Address) || string.IsNullOrWhiteSpace(person.TelephoneNumber)) // not all person data is entered
                {
                    peopleBs.Errors.Add("All fields are required.");
                    return false;
                }
            }

            // Must the telephone number be unique?
            if (telephoneNumberMustBeUnique == true) // check if the telephone number is unique
            {
                if (peopleBs.peopleDb.DoesTelephoneNumberExist(person.TelephoneNumber, excludePersonId).Result == true) // telephone number exists
                {
                    peopleBs.Errors.Add("Telephone number already exists in the database. Enter a different telephone number.");
                    return false;
                }
            }
            // all validations are fine
            return true;
        }

        public bool ValidatePaginatorData(ref int pageIndex, ref int pageSize)
        {
            const int maxPageSize = 150; // here enter the maximum page size allowed

            // validate ...
            // pageIndex and pageSize must be within these defined bounds:
            if (pageIndex < 0) { pageIndex = 0; }
            if (pageSize > maxPageSize || pageSize <= 0) { pageSize = maxPageSize; }

            // all validations are fine
            return true;
        }


        public void TrimPersonData(ref Person person)
        {
            person.FirstName = person.FirstName == null ? person.FirstName : person.FirstName.Trim();
            person.LastName = person.LastName == null ? person.LastName : person.LastName.Trim();
            person.Address = person.Address == null ? person.Address : person.Address.Trim();
            person.TelephoneNumber = person.TelephoneNumber == null ? person.TelephoneNumber : person.TelephoneNumber.Trim();
        }


        private bool IsStringInValidFormat(string inputString, int maxLength)
        {
            if (inputString == null || inputString.Trim() == "") return true; // string is in allowed format

            // Is string too long?
            if (inputString.Length > maxLength) // string is too long
            {
                peopleBs.Errors.Add("String is too long. A maximum of " + maxLength.ToString() + " is allowed.");
                return false;
            }

            // all fine
            return true;
        }
    }

}
