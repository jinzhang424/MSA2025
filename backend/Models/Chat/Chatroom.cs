public class Chatroom
{
    public int ChatroomId { get; set; }
    public string name { get;  set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Chatroom> ChatroomUsers { get; set; }
    public ICollection<Message> Messages { get; set; }

}