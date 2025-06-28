public class Chatroom
{
    public int ChatroomId { get; set; }
    public string Name { get;  set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ChatroomUser> ChatroomUsers { get; set; } = [];
    public ICollection<Message> Messages { get; set; } = [];
}