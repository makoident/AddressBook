/* *************************************** 
 * *******  BUSINESS LOGIC LAYER *********
 * *************************************** */

using AddressBook.BOL;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AddressBook.BLL
{
    public interface IPeopleBs
    {
        List<string> Errors { get; set; }

        bool Delete(Person person);
        Task<bool> DeletePersonAsync(int id);
        IEnumerable<Person> GetAll();
        Task<PeopleListForAngularUI> GetAllPeopleAsync(int pageIndex, int pageSize, bool orderByIdDesc);
        Person GetById(int id);
        Person GetByName(string name);
        Task<Person> GetByNameAsync(string name);
        Task<Person> GetPersonByIdAsync(int id);
        bool Insert(Person person);
        Task<bool> InsertPersonAsync(Person person);
        Task<PeopleListForAngularUI> SearchForPeopleAsync(int pageIndex, int pageSize, string firstName, string lastName, string address, string telephoneNumber);
        bool Update(Person person);
        Task<bool> UpdatePersonAsync(int id, Person person);
    }
}