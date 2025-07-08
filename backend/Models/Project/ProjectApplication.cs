public class ProjectApplication
{
    public DateTime dateApplied = DateTime.UtcNow;
    public String Status { get; set; } = "Pending";
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}