public class ProjectDto
{
    public string ProjectTitle { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = [];
    public int? NumOfPositions { get; set; }
}