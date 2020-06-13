/* ************************************ 
 * *******  DATA ACCESS LAYER *********
 * ************************************ */


using AddressBook.BOL;
using AddressBook.DAL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;


namespace AddressBook.DAL
{
    public class PeopleDb : IPeopleDb
    {
        /*
         * Dependency injection code here
         */
        private readonly PeopleDbContext db;

        public PeopleDb(PeopleDbContext db)
        {
            this.db = db;
        }
        /* End dependency injection code */








        /* ****************************************************************************************************************************************** 
         * ********************************************** DAL FOR QUERYING DATA OF PEOPLE FROM THE DB ***********************************************
         * ****************************************************************************************************************************************** */


        public async Task<PeopleListForAngularUI> GetAllPeopleAsync(int pageIndex, int pageSize, bool orderByIdDesc)
        {
            // Write the query (query does not yet execute here)
            IQueryable<Person> query = from m in db.Person
                                       select m;

            var queryResult = await query.ToListAsync(); // execute the query

            // NOTE: since this is a business object which will contain only getters and setters, I didn't DI it
            PeopleListForAngularUI peopleListForAngularUI = new PeopleListForAngularUI();
            peopleListForAngularUI.TotalCount = queryResult.Count(); // get total records count from the query
            if (orderByIdDesc == true)
            {
                peopleListForAngularUI.People = await query.OrderByDescending(x => x.Id).Skip(pageIndex * pageSize).Take(pageSize).ToListAsync(); // get the paginated records from the query
            } else
            {
                peopleListForAngularUI.People = await query.OrderBy(x => x.Id).Skip(pageIndex * pageSize).Take(pageSize).ToListAsync(); // get the paginated records from the query
            }

            return peopleListForAngularUI;
        }


        public async Task<PeopleListForAngularUI> SearchForPeopleAsync(int pageIndex, int pageSize, string firstName, string lastName, string address, string telephoneNumber)
        {
            // Write the query (query does not yet execute here)
            var query = from m in db.Person
                        where
                           m.FirstName.ToLower().Contains(firstName ?? m.FirstName.ToLower()) &&
                           m.LastName.ToLower().Contains(lastName ?? m.LastName.ToLower()) &&
                           m.Address.ToLower().Contains(address ?? m.Address.ToLower()) &&
                           m.TelephoneNumber.ToLower().Contains(telephoneNumber ?? m.TelephoneNumber.ToLower())
                        select m;

            var queryResult = await query.ToListAsync(); // execute the query

            // NOTE: since this is a business object which will contain only getters and setters, I didn't DI it
            PeopleListForAngularUI peopleListForAngularUI = new PeopleListForAngularUI
            {
                TotalCount = queryResult.Count(), // get total records count from the query
                People = await query.OrderBy(x => x.FirstName).ThenBy(x => x.LastName).ThenBy(x => x.Address).ThenBy(x => x.TelephoneNumber).Skip(pageIndex * pageSize).Take(pageSize).ToListAsync() // get the paginated records from the query
            };
            return peopleListForAngularUI;
        }

        public async Task<bool> DoesTelephoneNumberExist(string telephoneNumber, int excludePersonId)
        {
            // Search query for getting the telephone number from the DB
            var query = db.Person.Where(p => p.TelephoneNumber == telephoneNumber);

            // Do we need to exlude the telephone number of a user from the search query?
            if (excludePersonId != -1) // yes exclude the telephone number
            {
                query = query.Where(p => p.Id != excludePersonId);
            }

            int intCount = intCount = await query.CountAsync();
            if (intCount > 0) // telephone number exists
            {
                return true;
            }
            // telephone number does not exist in the DB

            return false;
        }
        public async Task<Person> GetPersonByIdAsync(int id)
        {
            return await db.Person.FindAsync(id);
        }

        public async Task<Person> GetByNameAsync(string name)
        {
            return await db.Person.Where(x => x.FirstName == name).FirstOrDefaultAsync();
        }













        /* ****************************************************************************************************************************************** 
         * ********************************************** DAL FOR CREATING, DELETING AND ADDING PEOPLE **********************************************
         * ****************************************************************************************************************************************** */



        public async Task<bool> InsertPersonAsync(Person person)
        {
            db.Person.Add(person);
            await SaveAsync();
            return true;
        }

        public async Task<bool> UpdatePersonAsync(Person person)
        {
            db.Entry(person).State = EntityState.Modified;
            await SaveAsync();
            return true;
        }

        public async Task<bool> DeletePersonAsync(Person person)
        {
            //Person person = db.Person.Find(id);
            db.Person.Remove(person);
            await SaveAsync();
            return true;
        }

        public async Task SaveAsync()
        {
            await db.SaveChangesAsync();
        }

































        /* ****************************************************************************************************************************************** 
         * ****************** SAME FUNCTIONS AS ABOVE BUT SYNCHRONOUS (not completed, just left them out here for reference) ************************
         * ****************************************************************************************************************************************** */


        public IEnumerable<Person> GetAll()
        {
            return db.Person.ToList();
        }
        public Person GetById(int id)
        {
            return db.Person.Find(id);
        }
        public Person GetByName(string name)
        {
            return db.Person.Where(x => x.FirstName == name).FirstOrDefault();
        }
        public void Insert(Person person)
        {
            db.Person.Add(person);
            Save();
        }
        public void Delete(Person person)
        {
            //Person person = db.Person.Find(id);
            db.Person.Remove(person);
            Save();
        }
        public void Update(Person person)
        {
            db.Entry(person).State = EntityState.Modified;
            Save();
        }
        public void Save()
        {
            db.SaveChanges();
        }

    }
}