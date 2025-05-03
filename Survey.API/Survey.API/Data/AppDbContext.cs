using Microsoft.EntityFrameworkCore;
using Survey.API.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Survey.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Survey.API.Models.Survey> Surveys { get; set; }
        public DbSet<SurveyOption> SurveyOptions { get; set; }
        public DbSet<Vote> Votes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Vote>()
                .HasIndex(v => new { v.UserId, v.SurveyOptionId })
                .IsUnique(); // Aynı kullanıcı aynı seçeneğe birden fazla oy veremesin
        }
    }
}
