public class ProjectMember
{
    public string Role { get; set; } = "Member";
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public DateTime JoinedAt = DateTime.UtcNow;
}