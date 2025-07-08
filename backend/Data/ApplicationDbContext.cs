using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Chatroom> Chatrooms { get; set; }
    public DbSet<ChatroomUser> ChatroomUser { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectMember> ProjectMembers { get; set; }
    public DbSet<ProjectApplication> ProjectApplication { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Setting the keys for different entities
        modelBuilder.Entity<User>()
            .HasKey(u => u.UserId);

        modelBuilder.Entity<Chatroom>()
            .HasKey(c => c.ChatroomId);

        modelBuilder.Entity<Message>()
            .HasKey(m => m.MessageId);

        modelBuilder.Entity<ChatroomUser>()
            .HasKey(cu => new { cu.UserId, cu.ChatroomId });

        modelBuilder.Entity<ProjectMember>()
            .HasKey(pm => new { pm.UserId, pm.ProjectId });

        modelBuilder.Entity<ProjectApplication>()
            .HasKey(pa => new { pa.ProjectId, pa.UserId });

        // Creating the many to many relationship between User and Chatroom
        modelBuilder.Entity<ChatroomUser>()
            .HasOne(cu => cu.User)
            .WithMany(u => u.ChatroomUsers)
            .HasForeignKey(uc => uc.UserId);

        modelBuilder.Entity<ChatroomUser>()
            .HasOne(cu => cu.Chatroom)
            .WithMany(c => c.ChatroomUsers)
            .HasForeignKey(uc => uc.ChatroomId);

        // Creating a one-to-many relalationship between a user and their messages
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.Messages)
            .HasForeignKey(m => m.SenderId);

        // Creating a one-to-many relalationship between a chatroom and its messages
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Chatroom)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ChatroomId);

        // Creating a many-to-many relationship between users and projects
        modelBuilder.Entity<ProjectMember>()
            .HasOne(pm => pm.User)
            .WithMany(u => u.ProjectMembers)
            .HasForeignKey(pm => pm.UserId);

        modelBuilder.Entity<ProjectMember>()
            .HasOne(pm => pm.Project)
            .WithMany(p => p.ProjectMembers)
            .HasForeignKey(pm => pm.ProjectId);

        // Creating a many-to-many relationship between a project waiting list and user
        modelBuilder.Entity<ProjectApplication>()
            .HasOne(pa => pa.User)
            .WithMany(u => u.ProjectApplicantions)
            .HasForeignKey(pwl => pwl.UserId);

        modelBuilder.Entity<ProjectApplication>()
            .HasOne(pa => pa.Project)
            .WithMany(p => p.ProjectApplications)
            .HasForeignKey(pwl => pwl.ProjectId);
    }
}