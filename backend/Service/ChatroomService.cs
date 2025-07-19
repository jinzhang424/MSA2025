public class ChatroomService(ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;

    public async Task CreateChatroom(string chatroomName, int ownerId)
    {
        // Creating the chatroom
        var chatroom = new Chatroom
        {
            Name = chatroomName,
            OwnerId = ownerId
        };

        await _context.Chatrooms.AddAsync(chatroom);
        await _context.SaveChangesAsync();

        // Adding the user to the chatroom
        var chatroomUser = new ChatroomUser
        {
            UserId = ownerId,
            ChatroomId = chatroom.ChatroomId
        };

        _context.ChatroomUser.Add(chatroomUser);
        _context.SaveChanges();
    }

    public async Task DeleteChatroom(int chatroomId)
    {
        // Finding the chatroom and throws an exception if not found
        var chatroom = _context.Chatrooms.FirstOrDefault(c => c.ChatroomId == chatroomId) ?? throw new ArgumentNullException("Chatroom not found");
        
        _context.Chatrooms.Remove(chatroom);
        await _context.SaveChangesAsync();
    }
}