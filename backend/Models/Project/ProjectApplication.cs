public class ProjectApplication
{
    public DateTime DateApplied { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string CoverMessage = "";
    public string Availablity = "";

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}