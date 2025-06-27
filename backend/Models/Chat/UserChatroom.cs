public class UserChatroom
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int ChatroomId { get; set; }
    public Chatroom Chatroom { get; set; } = null!;

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}