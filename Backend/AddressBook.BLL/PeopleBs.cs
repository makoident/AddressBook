/* *************************************** 
 * *******  BUSINESS LOGIC LAYER *********
 * *************************************** */

using AddressBook.BOL;
using AddressBook.DAL;
using AddressBook.DAL.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Data.Entity.Core.Mapping;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL
{


    public class PeopleBs : IPeopleBs
    {
        /*
         * Dependency injection code here
         */
        public readonly IPeopleDb peopleDb;
        public readonly IPersonValidator personValidator;

        public PeopleBs(IPeopleDb peopleDb, IPersonValidator personValidator)
        {
            this.peopleDb = peopleDb;

            this.personValidator = personValidator;
            this.personValidator.LoadPerson(this);
        }
        /* End dependency injection code */






        private readonly List<string> errors = new List<string>(); // will hold any validation errors that arise so they can be returned and outputted on the front end
        public List<string> Errors { get => errors; set { } }







        /* ****************************************************************************************************************************************** 
         * ********************************************** BS FOR GETTING PEOPLE FROM THE DB *********************************************************
         * ****************************************************************************************************************************************** */



        public async Task<PeopleListForAngularUI> GetAllPeopleAsync(int pageIndex, int pageSize, bool orderByIdDesc)
        {
            // Validation for data from paginator (pageIndex and pageSize)
            if (this.personValidator.ValidatePaginatorData(ref pageIndex, ref pageSize) == false) // errors arised
            {
                this.errors.Add("Incorrect paginator index and/or size.");
                return null;
            }
            // validation fine

            try
            {
                return await peopleDb.GetAllPeopleAsync(pageIndex, pageSize, orderByIdDesc);
            }
            catch (Exception ex)
            {
                this.errors.Add("Error arised while getting people from the database. Error: " + ex.Message);
                return null;
            }
        }


        public async Task<PeopleListForAngularUI> SearchForPeopleAsync(int pageIndex, int pageSize, string firstName, string lastName, string address, string telephoneNumber)
        {
            // Normalize the person data
            Person person = new Person
            {
                FirstName = firstName,
                LastName = lastName,
                Address = address,
                TelephoneNumber = telephoneNumber
            };
            this.personValidator.TrimPersonData(ref person);

            var noResult = new PeopleListForAngularUI { People = null, TotalCount = 0 };

            // Validation for the pagination data
            if (this.personValidator.ValidatePaginatorData(ref pageIndex, ref pageSize) == false) // errors arised
            {
                return null;
            }
            // Validation for person's the data
            if (this.personValidator.ValidatePersonData(person) == false) // errors arised
            {
                return null;
            }
            // validation fine

            try
            {
                return await peopleDb.SearchForPeopleAsync(pageIndex, pageSize, firstName, lastName, address, telephoneNumber);
            }
            catch (Exception ex)
            {
                this.errors.Add("Error arised while searching for people in the database. Error: " + ex.Message);
                return null;
            }
        }

        public async Task<Person> GetPersonByIdAsync(int id)
        {
            Person person;
            
            // Get the person from the DB
            try
            {
                person = await peopleDb.GetPersonByIdAsync(id);
            }
            catch (Exception ex)
            {
                this.errors.Add("Error arised while getting the person with id " + id.ToString() + " from the database. Error: " + ex.Message);
                return null;
            }

            // Was person successfully got from the DB?
            if (person == null) // no person with this id could not be found in the db
            {
                this.errors.Add("No person with id " + id.ToString() + " exists in the database.");
                return null;
            }

            return person;
        }














        /* ****************************************************************************************************************************************** 
         * ********************************************** BS FOR CREATING, DELETING AND ADDING PEOPLE ***********************************************
         * ****************************************************************************************************************************************** */




        public async Task<bool> InsertPersonAsync(Person person)
        {
            // Normalize the person data
            this.personValidator.TrimPersonData(ref person);

            // Validation for data from the search form
            if (this.personValidator.ValidatePersonData(person, true, true) == false) // errors arised
            {
                return false;
            }
            // validation fine

            try
            {
                await peopleDb.InsertPersonAsync(person);
            }
            catch (Exception ex)
            {
                this.errors.Add("Error arised while inserting the person in the database. Error: " + ex.Message);
                return false;
            }
            return true;
        }

        public async Task<bool> UpdatePersonAsync(int id, Person person)
        {
            // Normalize the person data
            this.personValidator.TrimPersonData(ref person);

            // Validation for person's data
            if (this.personValidator.ValidatePersonData(person, true, true, id) == false) // errors arised
            {
                return false;
            }

            if (id != person.Id)
            {
                this.errors.Add("Something is wrong with the request.");
                return false;
            }
            // validation fine

            try
            {
                await peopleDb.UpdatePersonAsync(person);
            }
            catch (Exception ex)
            {
                this.errors.Add("Error arised while updating the person in the database. Error: " + ex.Message);
                return false;
            }
            return true;
        }

        public async Task<bool> DeletePersonAsync(int id)
        {
            // Does the person for deletion exist in the DB?
            Person person = await this.GetPersonByIdAsync(id);
            if (person == null) // some error arised or person could not be found in the DB
            {
                return false;
            }
            // yes, person exists in the db

            try
            {
                await peopleDb.DeletePersonAsync(person);
            }
            catch (Exception ex)
            {
                this.errors.Add("Error arised while deleting the person from the database. Error: " + ex.Message);
                return false;
            }
            return true;
        }

        public Task<Person> GetByNameAsync(string name)
        {
            return peopleDb.GetByNameAsync(name);
        }




























        /* ****************************************************************************************************************************************** 
         * ****************** SAME FUNCTIONS AS ABOVE BUT SYNCHRONOUS (not completed, just left them out here for reference) ************************
         * ****************************************************************************************************************************************** */



        public IEnumerable<Person> GetAll()
        {
            return peopleDb.GetAll();
        }
        public Person GetById(int id)
        {
            return peopleDb.GetById(id);
        }
        public Person GetByName(string name)
        {
            return peopleDb.GetByName(name);
        }
        public bool Insert(Person person)
        {
            peopleDb.Insert(person);
            return true;
        }
        public bool Delete(Person person)
        {
            peopleDb.Delete(person);
            return true;
        }
        public bool Update(Person person)
        {
            peopleDb.Update(person);
            return true;
        }




















    }













}
