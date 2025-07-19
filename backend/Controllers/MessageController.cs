using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Service;
using Microsoft.AspNetCore.SignalR;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/Message")]
public class MessageController(ApplicationDbContext context, JwtTokenService jwtService, IHubContext<ChatHub> hubContext) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly JwtTokenService _jwtService = jwtService;
    private readonly IHubContext<ChatHub> _hubContext = hubContext;

    [HttpPost("SendMessages")]
    public async Task<IActionResult> SendMessage([FromBody] MessageDto messageDto)
    {
        // Ensuring the token is valid
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
        await _context.SaveChangesAsync();

        // Broadcast to SignalR group
        var sender = await _context.Users.FindAsync(userId);
        await _hubContext.Clients.Group(messageDto.ChatroomId.ToString()).SendAsync(
            "ReceiveMessage",
            new {
                messageId = message.MessageId,
                senderId = message.SenderId,
                senderFirstName = sender?.FirstName,
                senderLastName = sender?.LastName,
                content = message.Content,
                chatroomId = message.ChatroomId,
                createdAt = message.CreatedAt
            }
        );

        return Ok("Successfully sent message");
    }

    [HttpGet("GetChatroomMessages/{chatroomId}")]
    public IActionResult GetMessages(int chatroomId)
    {
        // Ensuring the token is valid
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

        // Getting the messages and returning them in the expected structure
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
                chatroomId = m.ChatroomId,
                createdAt = m.CreatedAt
            })
            .ToList();

        return Ok(messages);
    }
}