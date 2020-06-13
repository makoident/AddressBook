/* **************************************** 
 * *******  BUSINESS OBJECT LAYER *********
 * **************************************** */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace AddressBook.BOL
{
    [Table("Person")]
    public partial class Person
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(50, ErrorMessage = "Maximum of 50 characters are allowed for the person's first name.")]
        [Required(ErrorMessage = "Please enter person's first name.")]
        public string FirstName { get; set; }

        [MaxLength(50, ErrorMessage = "Maximum of 50 characters are allowed for the person's last name.")]
        [Required(ErrorMessage = "Please enter person's last name.")]
        public string LastName { get; set; }

        [MaxLength(100, ErrorMessage = "Maximum of 100 characters are allowed for the person's address.")]
        [Required(ErrorMessage = "Please enter person's address.")]
        public string Address { get; set; }

        [MaxLength(50, ErrorMessage = "Maximum of 50 characters are allowed for the person's telephone number.")]
        [Required(ErrorMessage = "Please enter person's telephone number.")]
        public string TelephoneNumber { get; set; }

    }

}