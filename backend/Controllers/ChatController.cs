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

    

    [HttpGet("GetChatroomUsers/{chatroomId}")]
    public IActionResult GetChatroomUsers(int chatroomId)
    {
        // Getting the users of a particular chatroom
        var chatroomUsers = _context.ChatroomUser
            .Where(cu => cu.ChatroomId == chatroomId)
            .Include(cu => cu.User)
            .Select(cu => new
            {
                cu.User.UserId,
                cu.User.FirstName,
                cu.User.LastName,
                cu.User.Email,
            })
            .ToList();

        return Ok(chatroomUsers);
    }

    [HttpPut("AddChatroomUser")]
    public async Task<IActionResult> AddChatroomUser([FromBody] ChatroomUserDto chatroomUserDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        // Checking if that the user and chatroom exists
        var chatroom = await _context.Chatrooms.FirstOrDefaultAsync(c => c.ChatroomId == chatroomUserDto.ChatroomId);
        if (!_context.Users.Any(u => u.UserId == chatroomUserDto.RequesterId) ||
            chatroom == null)
        {
            return NotFound("User or chatroom not found");
        }

        // Prevent non-owners from adding people to the chatroom
        if (int.Parse(userId) != chatroom.OwnerId)
        {
            return Unauthorized("Only owners can add others to the chatroom");
        }

        var chatroomUser = new ChatroomUser
        {
            UserId = chatroomUserDto.RequesterId,
            ChatroomId = chatroomUserDto.ChatroomId
        };

        _context.ChatroomUser.Add(chatroomUser);
        _context.SaveChanges();

        return Ok("Successfully added user to chatroom");
    }

    [HttpDelete("RemoveUser/{victimId}")]
    public IActionResult RemoveUser([FromBody] ChatroomUserDto chatroomUserDto, int victimId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var chatroomUser = _context.ChatroomUser.FirstOrDefault(
            cu => cu.UserId == chatroomUserDto.RequesterId && cu.ChatroomId == chatroomUserDto.ChatroomId);
        var chatroom = _context.Chatrooms.FirstOrDefault(
            c => c.ChatroomId == chatroomUserDto.ChatroomId);

        // Checking if that the user and chatroom exists
        if (chatroomUser == null || chatroom == null)
        {
            return NotFound("User or chatroom not found");
        }

        // Users can remove themselves but not others unless they are the creator of the chatroom
        if (chatroomUser.UserId != chatroom.OwnerId && chatroomUser.UserId != victimId)
        {
            return BadRequest("Insufficient Permissions to remove this user");
        }

        // Preventing the chat owner from removing themselves if there are still others in the chat
        var chatroomUserCount = _context.ChatroomUser.Count();
        if (chatroomUser.UserId == chatroom.OwnerId && chatroomUserCount > 1)
        {
            return BadRequest("You cannot remove yourself as you are the owner and there are still others in this chat.");
        }

        _context.ChatroomUser.Remove(chatroomUser);
        _context.SaveChanges();
        return Ok("Successfully removed user from chatroom");
    }
    
    [Authorize]
    [HttpGet("GetChatroomListings")]
    public async Task<IActionResult> GetChatroomListings()
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