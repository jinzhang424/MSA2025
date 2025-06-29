public class User
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public ICollection<ChatroomUser> ChatroomUsers { get; set; } = [];
    public ICollection<Message> Messages { get; set; } = [];
    
    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    public ICollection<ProjectWaitingListUser> WaitingListUsers { get; set; } = [];
}