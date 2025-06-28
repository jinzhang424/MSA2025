public class ChatroomUser
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ChatroomId { get; set; }
    public Chatroom Chatroom { get; set; } = null!;
    
    public DateTime JoinAt { get; set; } = DateTime.UtcNow;
}