public class Project
{
    public int ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public int TotalSpots { get; set; }
    public List<string> Skills { get; set; } = [];
    public string Duration { get; set; } = string.Empty;
    public int OwnerId { get; set; }
    public string Status { get; set; } = "Active";

    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    public ICollection<ProjectApplication> ProjectApplications { get; set; } = null!;

}