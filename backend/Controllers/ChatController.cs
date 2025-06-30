using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("Chatroom")]

public class ChatController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtService;

    public ChatController(ApplicationDbContext context, JwtTokenService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("CreateChatroom")]
    public IActionResult CreateChatroom([FromBody] ChatroomDto chatroomDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var chatroom = new Chatroom
        {
            Name = chatroomDto.Name,
            OwnerId = chatroomDto.OwnerId
        };

        _context.Chatrooms.Add(chatroom);
        _context.SaveChanges();

        var chatroomUser = new ChatroomUser
        {
            UserId = chatroomDto.OwnerId,
            ChatroomId = chatroom.ChatroomId
        };

        _context.ChatroomUser.Add(chatroomUser);
        _context.SaveChanges();

        return Ok("Successfully created chatroom");
    }

    [HttpGet("GetChatroomUsers/{chatroomId}")]
    public IActionResult GetChatroomUsers(int chatroomId)
    {
        var chatroomExists = _context.Chatrooms.Any(c => c.ChatroomId == chatroomId);
        if (!chatroomExists)
        {
            return NotFound("Chatroom not found");
        }

        var chatroomUsers = _context.ChatroomUser
            .Where(cu => cu.ChatroomId == chatroomId)
            .Include(cu => cu.User)
            .Select(cu => new
            {
                cu.User.UserId,
                cu.User.Name,
                cu.User.Email,
            })
            .ToList();

        return Ok(chatroomUsers);
    }

    [HttpDelete("DeleteChatroom")]
    public IActionResult DeleteChatroom([FromBody] ChatroomUserDto chatroomDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var chatroom = _context.Chatrooms.FirstOrDefault(c => c.ChatroomId == chatroomDto.ChatroomId);
        if (chatroom == null)
        {
            return NotFound("Chatrooom not found");
        }

        if (int.Parse(userId) != chatroom.OwnerId)
        {
            return Unauthorized("Only owners can delete a chatroom");
        }

        _context.Chatrooms.Remove(chatroom);
        _context.SaveChanges();
        
        return Ok("Successfully deleted chatroom");
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
        if (chatroomUser.UserId == chatroom.OwnerId && chatroomUserCount > 1) {
            return BadRequest("You cannot remove yourself as you are the owner and there are still others in this chat.");
        }

        _context.ChatroomUser.Remove(chatroomUser);
        _context.SaveChanges();
        return Ok("Successfully removed user from chatroom");
    }
}