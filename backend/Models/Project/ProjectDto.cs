public class ProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = [];
    public int TotalSpots { get; set; }
    public string? Imageurl { get; set; }
    public string Duration { get; set; } = string.Empty;
}