using Microsoft.EntityFrameworkCore;
using Survey.API.Models.Entities;

namespace Survey.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<SurveyEntity> Surveys { get; set; }
        public DbSet<SurveyOption> SurveyOptions { get; set; }
        public DbSet<Vote> Votes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<SurveyEntity>()
                .HasOne(s => s.CreatedByUser)
                .WithMany(u => u.Surveys)
                .HasForeignKey(s => s.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SurveyOption>()
                .HasOne(o => o.Survey)
                .WithMany(s => s.Options)
                .HasForeignKey(o => o.SurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Vote>()
                .HasOne(v => v.User)
                .WithMany(u => u.Votes)
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vote>()
                .HasOne(v => v.Survey)
                .WithMany(s => s.Votes)
                .HasForeignKey(v => v.SurveyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vote>()
                .HasOne(v => v.Option)
                .WithMany(o => o.Votes)
                .HasForeignKey(v => v.OptionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 