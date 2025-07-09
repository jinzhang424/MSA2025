public class User
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = null!;
    public string Bio { get; set; } = string.Empty;
    public string? ProfileImage { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = [];

    public ICollection<ChatroomUser> ChatroomUsers { get; set; } = [];
    public ICollection<Message> Messages { get; set; } = [];
    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    public ICollection<ProjectApplication> ProjectApplicantions { get; set; } = [];
}