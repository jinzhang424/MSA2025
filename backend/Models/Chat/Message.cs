public class Message
{
    public long MessageId { get; set; }
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int SenderId { get; set; }
    public User User { get; set; } = null!;

    public int ChatroomId { get; set; }
    public Chatroom Chatroom { get; set; } = null!;
}