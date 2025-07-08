public class Project
{
    public int ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = [];
    public int? NumOfPositions { get; set; }

    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    public ICollection<ProjectApplication> ProjectApplications { get; set; } = null!;

}