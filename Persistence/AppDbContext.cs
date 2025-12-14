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
            .HasForeignKey(fk => fk.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ActivityAttendee>()
            .HasOne(o => o.Activity)
            .WithMany(m => m.Attendees)
            .HasForeignKey(fk => fk.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserFollow>(k => k.HasKey(a => new { a.FollowingId, a.FollowerId }));

        builder.Entity<UserFollow>()
            .HasOne(o => o.Following)
            .WithMany(m => m.Followers)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserFollow>()
            .HasOne(o => o.Follower)
            .WithMany(m => m.Followings)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public DbSet<Domain.Activity> Activities { get; set; }
    public DbSet<ActivityAttendee> ActivitiesAttendees { get; set; }
    public DbSet<Photo> Photos{ get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserFollow> UsersFollows { get; set; }
    public IEnumerable<object> ActivityAttendees { get; set; }
}
