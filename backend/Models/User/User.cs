public class User
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public ICollection<UserChatroom> UserChatrooms { get; set; } = [];
    public ICollection<Message> Messages { get; set; } = [];
}