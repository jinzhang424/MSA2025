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

    public async Task DeleteChatroom(int userId, int chatroomId)
    {
        var chatroom = _context.Chatrooms.FirstOrDefault(c => c.ChatroomId == chatroomId) ?? throw new ArgumentNullException("Chatroom not found");

        if (userId != chatroom.OwnerId)
        {
            throw new UnauthorizedAccessException("Only owners can delete a chatroom");
        }

        _context.Chatrooms.Remove(chatroom);
        await _context.SaveChangesAsync();
    }
}