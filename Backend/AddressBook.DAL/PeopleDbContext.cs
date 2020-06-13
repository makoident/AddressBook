using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using AddressBook.BOL;
using Microsoft.EntityFrameworkCore;

namespace AddressBook.DAL.Data
{
    
    /* The main class that coordinates Entity Framework functionality is the DbContext class */
    public class PeopleDbContext : DbContext
    {
        public PeopleDbContext(DbContextOptions<PeopleDbContext> options) : base(options)
        {
            this.Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Create unique index on TelephoneNumber column
            modelBuilder.Entity<Person>()
                .HasIndex(u => u.TelephoneNumber)
                .IsUnique();
        }

        public DbSet<Person> Person { get; set; }
    }

}
