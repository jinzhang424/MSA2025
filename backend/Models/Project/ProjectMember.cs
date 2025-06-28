public class ProjectMember
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public DateTime CreatedAt = DateTime.UtcNow;
}