public class Project
{
    public int ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? Tags { get; set; } = string.Empty;
    public int? NumOfPositions { get; set; }

    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    public ProjectWaitingList ProjectWaitingList { get; set; } = null!;

}