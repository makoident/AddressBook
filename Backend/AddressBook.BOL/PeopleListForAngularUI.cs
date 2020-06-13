/* **************************************** 
 * *******  BUSINESS OBJECT LAYER *********
 * **************************************** */


using System;
using System.Collections.Generic;
using System.Text;

namespace AddressBook.BOL
{


    /* ****************************************************************************************************************************************** 
     * ********************************************** CLASS CONTAINING DATA FOR PAGINATION FOR ANGULAR UI ***************************************
     * ****************************************************************************************************************************************** */

    public class PeopleListForAngularUI
    {
        public IEnumerable<Person> People { get; set; }
        public int TotalCount { get; set; }
    }
}
