using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Service;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/Message")]
public class MessageController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtService;

    public MessageController(ApplicationDbContext context, JwtTokenService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("SendMessages")]
    public IActionResult SendMessage([FromBody] MessageDto messageDto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }
        var userId = int.Parse(userIdString);

        // Checking if the user is actually a part of the chatroom
        var userExistsInChat = _context.ChatroomUser.Any(cu =>
            cu.UserId == userId && cu.ChatroomId == messageDto.ChatroomId);
        if (!userExistsInChat)
        {
            return Unauthorized("You must be part of the chatroom to send a message");
        }

        var message = new Message
        {
            SenderId = userId,
            Content = messageDto.Content,
            ChatroomId = messageDto.ChatroomId
        };

        _context.Messages.Add(message);
        _context.SaveChanges();
        return Ok("Successfully sent message");
    }

    [HttpGet("GetChatroomMessages/{chatroomId}")]
    public IActionResult GetMessages(int chatroomId)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid token");
        }
        var userId = int.Parse(userIdString);

        // Checking if user is part of chatroom before getting all the messages
        var userExistsInChatroom = _context.ChatroomUser
            .Any(cu => cu.ChatroomId == chatroomId && cu.UserId == userId);
        if (!userExistsInChatroom)
        {
            return Unauthorized("Insufficient permission to view this chatroom's messages");
        }

        var messages = _context.Messages
            .Where(m => m.ChatroomId == chatroomId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new
            {
                messageId = m.MessageId,
                senderId = m.SenderId,
                senderFirstName = m.Sender.FirstName,
                senderLastName = m.Sender.LastName,
                content = m.Content,
                createdAt = m.CreatedAt
            })
            .ToList();

        return Ok(messages);
    }
}