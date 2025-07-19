public class ChatroomService(ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;

    public async Task CreateChatroom(string chatroomName, int projectId, int ownerId, bool isGroup)
    {
        // Creating the chatroom
        var chatroom = new Chatroom
        {
            Name = chatroomName,
            IsGroup = isGroup,
            ProjectId = projectId,
            OwnerId = ownerId
        };

        await _context.Chatrooms.AddAsync(chatroom);
        await _context.SaveChangesAsync();

        // Adding the user to the chatroom
        await AddUser(chatroom.ChatroomId, ownerId);
    }

    public async Task AddUser(int chatroomId, int userId)
    {
        var chatroomUser = new ChatroomUser
        {
            UserId = userId,
            ChatroomId = chatroomId
        };

        await _context.ChatroomUser.AddAsync(chatroomUser);
        _context.SaveChanges();
    }
}