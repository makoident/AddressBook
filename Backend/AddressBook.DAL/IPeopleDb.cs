/* ************************************ 
 * *******  DATA ACCESS LAYER *********
 * ************************************ */


using AddressBook.BOL;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AddressBook.DAL
{
    public interface IPeopleDb
    {
        void Delete(Person person);
        Task<bool> DeletePersonAsync(Person person);
        Task<bool> DoesTelephoneNumberExist(string telephoneNumber, int excludePersonId);
        IEnumerable<Person> GetAll();
        Task<PeopleListForAngularUI> GetAllPeopleAsync(int pageIndex, int pageSize, bool orderByIdDesc);
        Person GetById(int id);
        Person GetByName(string name);
        Task<Person> GetByNameAsync(string name);
        Task<Person> GetPersonByIdAsync(int id);
        void Insert(Person person);
        Task<bool> InsertPersonAsync(Person person);
        void Save();
        Task SaveAsync();
        Task<PeopleListForAngularUI> SearchForPeopleAsync(int pageIndex, int pageSize, string firstName, string lastName, string address, string telephoneNumber);
        void Update(Person person);
        Task<bool> UpdatePersonAsync(Person person);
    }
}