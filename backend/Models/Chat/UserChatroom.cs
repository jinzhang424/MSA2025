public class UserChatroom
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid ChatroomId { get; set; }
    public Chatroom Chatroom { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}