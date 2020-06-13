/* *************************************** 
 * *******  FOR TESTING PURPOSES *********
 * *************************************** */

using AddressBook.BLL;
using AddressBook.BOL;
using System;

namespace AddressBook.ConsoleUI
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("ConsoleUI for testing purposes");

            // Make a test insertion in the DB through the DAL
            /*using (var context = new PeopleDbContext("PeopleDatabase"))
            {
                PeopleDb db = new PeopleDb(context);
                db.Insert(new Person { FirstName = "marko2", LastName = "sekardi2", Address = "prade2", TelephoneNumber = "3323222" });
            }*/

            // Make a test insertion in the DB through the BLL
            /*PeopleBs db = new PeopleBs();
            db.Insert(new Person { FirstName = "sderre", LastName = "sekardi2", Address = "prade2", TelephoneNumber = "3323222" });*/
            //db.Update(new Person { Id = 1, FirstName = "sderre", LastName = "dffgfg", Address = "gfgf", TelephoneNumber = "777" });

        }
    }
}
