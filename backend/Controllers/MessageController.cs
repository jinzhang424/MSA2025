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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid Token");
        }

        if (int.Parse(userId) != messageDto.SenderId)
        {
            return BadRequest("Sender id and user id do not match");
        }

        // Checking if the user is actually a part of the chatroom
        var userExistsInChat = _context.ChatroomUser.Any(cu =>
            cu.UserId == messageDto.SenderId && cu.ChatroomId == messageDto.ChatroomId);
        if (!userExistsInChat)
        {
            return Unauthorized("You must be part of the chatroom to send a message");
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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        // Checking if user is part of chatroom before getting all the messages
        var userExistsInChatroom = _context.ChatroomUser
            .Any(cu => cu.ChatroomId == chatroomId && cu.UserId == chatroomId);
        if (!userExistsInChatroom)
        {
            return Unauthorized("Insufficient permission to view this chatroom's messages");
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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var message = _context.Messages
            .FirstOrDefault(m => m.MessageId == messageId && m.SenderId == int.Parse(userId));
        if (message == null)
        {
            return NotFound("Insufficient permission to delete this message");
        }

        _context.Messages.Remove(message);
        _context.SaveChanges();

        return Ok("Successfully removed message");
    }
}