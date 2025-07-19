using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Service;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/Chatroom")]

public class ChatController(ApplicationDbContext context, JwtTokenService jwtService) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly JwtTokenService _jwtService = jwtService;
    
    [Authorize]
    [HttpGet("GetChatrooms")]
    public async Task<IActionResult> GetChatrooms()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
            return Unauthorized("Invalid token");

        int userId = int.Parse(userIdString);

        // Get all chatrooms the user is a participant in
        var chatrooms = await _context.Chatrooms
            .Include(c => c.ChatroomUsers)
                .ThenInclude(cu => cu.User)
            .Include(c => c.Messages)
            .Where(c => c.ChatroomUsers.Any(cu => cu.UserId == userId))
            .ToListAsync();

        var result = chatrooms.Select(chatroom =>
        {
            var lastMsg = chatroom.Messages
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new {
                    m.SenderId,
                    m.Sender.FirstName,
                    m.Content,
                    m.CreatedAt
                })
                .FirstOrDefault();

            return new
            {
                chatroomId = chatroom.ChatroomId,
                name = chatroom.Name,
                isGroup = chatroom.IsGroup,
                participants = chatroom.ChatroomUsers.Select(cu => new
                {
                    userId = cu.User.UserId,
                    image = cu.User.ProfileImage,
                    firstName = cu.User.FirstName,
                    lastName = cu.User.LastName
                }).ToList(),
                lastMessage = lastMsg == null? null : new
                {
                    senderId = lastMsg.SenderId,
                    senderFirstName = lastMsg.FirstName,
                    content = lastMsg.Content,
                    createdAt = lastMsg.CreatedAt
                }
            };
        }).ToList();

        return Ok(result);
    }
}