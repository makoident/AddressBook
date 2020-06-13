/* *************************************** 
 * *******  BUSINESS LOGIC LAYER *********
 * *************************************** */

using AddressBook.BOL;

namespace AddressBook.BLL
{
    public interface IPersonValidator
    {
        void LoadPerson(PeopleBs peopleBs);
        void TrimPersonData(ref Person person);
        bool ValidatePaginatorData(ref int pageIndex, ref int pageSize);
        bool ValidatePersonData(Person person, bool telephoneNumberMustBeUnique = false, bool allFieldsRequired = false, int excludePersonId = -1);
    }
}