/* *************************************** 
 * *******  WEB API LAYER ****************
 * *************************************** */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AddressBook.BOL;
using AddressBook.BLL;
using System.Diagnostics;
using System.Configuration;
using Microsoft.Extensions.Configuration;
using System.Threading; // TODO: this is used just for testing the frontend loading animation in the UI. It should be removed completely in production

namespace AddressBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly IPeopleBs peopleBs;

        public PeopleController(IPeopleBs peopleBs)
        {
            Thread.Sleep(500); // use this to test the angular UI against long api calls
            this.peopleBs = peopleBs;
        }









        /* ****************************************************************************************************************************************** 
         * ********************************************** API FOR GETTING PEOPLE FROM THE DB ********************************************************
         * ****************************************************************************************************************************************** */



        // GET: api/People
        [HttpGet]
        public async Task<ActionResult<PeopleListForAngularUI>> GetPeople(int pageIndex, int pageSize, bool orderByIdDesc)
        {
            // Get all people from the DB
            PeopleListForAngularUI people = new PeopleListForAngularUI(); // since this is an business object with only getter and setters, I decided not to implement DI on it
            people = await peopleBs.GetAllPeopleAsync(pageIndex, pageSize, orderByIdDesc);
            if (people == null) // Error arised on 
            {
                this.CreateErrorModelState();
                return BadRequest(ModelState);
            }
            return Ok(people);
        }


        // GET: api/People/SearchForPeople
        [HttpGet("SearchForPeople")]
        public async Task<ActionResult<PeopleListForAngularUI>> SearchForPeople(int pageIndex, int pageSize, string firstName, string lastName, string address, string telephoneNumber)
        {
            // Search for people
            PeopleListForAngularUI people = await peopleBs.SearchForPeopleAsync(pageIndex, pageSize, firstName, lastName, address, telephoneNumber);
            if (people == null) // Error arised on search for people
            {
                this.CreateErrorModelState();
                return BadRequest(ModelState);
            }
            return Ok(people);
        }


        // GET: api/People/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            // Does the person exist in the DB?
            Person person = await peopleBs.GetPersonByIdAsync(id);
            if (person == null) // some error arised or person could not be found in the DB
            {
                this.CreateErrorModelState();
                return BadRequest(ModelState);
            }
            // yes, person exists in the db -> return it to the client

            return Ok(person);
        }


        private void CreateErrorModelState()
        {
            foreach (string error in peopleBs.Errors )
            {
                ModelState.AddModelError("APIErrors", error);
            }
        }

















        /* ****************************************************************************************************************************************** 
         * ********************************************** API FOR CREATING, DELETING AND UPDATING PEOPLE ********************************************
         * ****************************************************************************************************************************************** */





        // POST: api/People/CreatePerson
        // To protect from overposting attacks, enable the specific properties you want to bind to, for more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost("CreatePerson")]
        public async Task<ActionResult<Person>> CreatePerson(Person person)
        {
            // Insert the person
            bool success = await peopleBs.InsertPersonAsync(person);
            if (success == false) // Error arised on insert
            {
                this.CreateErrorModelState();
                return BadRequest(ModelState);
            }
            // Insert was successfull

            return CreatedAtAction("CreatePerson", new { id = person.Id }, person);
        }


        // PUT: api/People/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePerson(int id, Person person)
        {
            // Update the person's data in the DB
            bool success = await peopleBs.UpdatePersonAsync(id, person);
            if (success == false) // Error arised on update
            {
                this.CreateErrorModelState();
                return BadRequest(ModelState);
            }
            // Update was successfull

            return Ok();
        }


        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Person>> DeletePerson(int id)
        {
            // Delete the person
            bool success = await peopleBs.DeletePersonAsync(id);
            if (success == false) // Error arised on delete
            {
                this.CreateErrorModelState();
                return BadRequest(ModelState);
            }
            // Delete was successfull

            return Ok();
        }


    }
}
