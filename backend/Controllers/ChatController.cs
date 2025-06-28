using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("Chatroom")]

public class ChatController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ChatController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("CreateChatroom")]
    public IActionResult CreateChatroom([FromBody] ChatroomDto chatroomDto)
    {
        var userExists = _context.Users.Any(u => u.UserId == chatroomDto.OwnerId);
        if (!userExists)
        {
            return BadRequest("Missing owner id");
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
        var chatroom = _context.Chatrooms.FirstOrDefault(c => c.ChatroomId == chatroomDto.RequesterId);
        if (chatroom == null)
        {
            return NotFound("Chatrooom not found");
        }

        _context.Chatrooms.Remove(chatroom);
        _context.SaveChanges();
        
        return Ok("Successfully deleted chatroom");
    }

    [HttpPut("AddChatroomUser")]
    public IActionResult AddChatroomUser([FromBody] ChatroomUserDto chatroomUserDto)
    {
        // Checking if that the user and chatroom exists
        if (!_context.Users.Any(u => u.UserId == chatroomUserDto.RequesterId) ||
            !_context.Chatrooms.Any(c => c.ChatroomId == chatroomUserDto.ChatroomId))
        {
            return NotFound("User or chatroom not found");
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