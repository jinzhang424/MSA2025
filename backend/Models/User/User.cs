public class User
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }

    public ICollection<UserChatroom> UserChatrooms { get; set; } = [];
    public ICollection<Message> Messages { get; set; } = [];
}