public class Message
{
    public long MessageId { get; set; } // BIGSERIAL
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int SenderId { get; set; }
    public User User { get; set; }

    public int ChatroomId { get; set; }
    public Chatroom Chatroom { get; set; }
}