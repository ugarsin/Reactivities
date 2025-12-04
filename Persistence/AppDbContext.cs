using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace Persistence;

public class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ActivityAttendee>(k => k.HasKey(a => new { a.ActivityId, a.UserId }));

        builder.Entity<ActivityAttendee>()
            .HasOne(o => o.User)
            .WithMany(m => m.Activities)
            .HasForeignKey(fk => fk.UserId);

        builder.Entity<ActivityAttendee>()
            .HasOne(o => o.Activity)
            .WithMany(m => m.Attendees)
            .HasForeignKey(fk => fk.ActivityId);
    }

    public DbSet<Domain.Activity> Activities { get; set; }
    public DbSet<ActivityAttendee> ActivitiesAttendees { get; set; }
}
