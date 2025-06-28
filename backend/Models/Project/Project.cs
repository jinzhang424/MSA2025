public class Project
{
    public int ProjectId { get; set; }
    public int NumOfPositions { get; set; }
    public string Tags { get; set; }
    public string ProjectTitle { get; set; }
    public string Description { get; set; }

    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
}