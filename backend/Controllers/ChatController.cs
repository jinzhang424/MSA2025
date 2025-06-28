using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("ChatRoom")]

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
        return Ok("Successfully created chatroom");
    }

    [HttpDelete("DeleteChatroom")]
    public IActionResult DeleteChatroom()
    {
        // TODO: Delete a chatroom
        return Ok("Successfully deleted chatroom");
    }

    [HttpPut("AddUser")]
    public IActionResult AddUser()
    {
        // TODO: Add a user to chatroom
        return Ok("Successfully added user to chatroom");
    }

    [HttpDelete("RemoveUser")]
    public IActionResult RemoveUser()
    {
        // TODO: Remove a user from the chatroom
        return Ok("Successfully removed user to chatroom");
    }
}