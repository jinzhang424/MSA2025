using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Message")]
public class MessageController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MessageController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("SendMessages")]
    public IActionResult SendMessage([FromBody] MessageDto messageDto)
    {
        var chatExists = _context.Chatrooms.Any(c => c.ChatroomId == messageDto.ChatroomId);
        var userExists = _context.Users.Any(u => u.UserId == messageDto.SenderId);
        if (!chatExists || !userExists)
        {
            return NotFound("Chatroom or user not found");
        }

        // Checking if the user is actually a part of the chatroom
        var userExistsInChat = _context.ChatroomUser.Any(cu =>
            cu.UserId == messageDto.SenderId && cu.ChatroomId == messageDto.ChatroomId);
        if (!userExistsInChat)
        {
            return BadRequest("The user does not have permission to message in this chatroom");
        }

        var message = new Message
        {
            Content = messageDto.Content,
            SenderId = messageDto.SenderId,
            ChatroomId = messageDto.ChatroomId
        };

        _context.Messages.Add(message);
        _context.SaveChanges();
        return Ok("Successfully sent message");
    }

    [HttpGet("GetChatroomMessages/{chatroomId}")]
    public IActionResult GetMessages(int chatroomId)
    {
        var chatroomExists = _context.Chatrooms.Any(c => c.ChatroomId == chatroomId);
        if (!chatroomExists)
        {
            return NotFound("Chatroom not found");
        }

        var messages = _context.Messages
            .Where(m => m.ChatroomId == chatroomId)
            .OrderBy(m => m.CreatedAt)
            .ToList();

        return Ok(messages);
    }
    
    [HttpDelete("DeleteMessage/{messageId}")]
    public IActionResult DeleteMessage(int messageId)
    {
        var message = _context.Messages.FirstOrDefault(m => m.MessageId == messageId);
        if (message == null)
        {
            return NotFound("Message not found.");
        }

        _context.Messages.Remove(message);
        _context.SaveChanges();

        return Ok("Successfully removed message");
    }
}