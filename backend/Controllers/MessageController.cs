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
    public IActionResult SendMessage()
    {
        return Ok("Successfully sent message");
    }

    [HttpGet("GetMessages")]
    public IActionResult GetMessages()
    {
        return Ok("Successfully got messages");
    }
    
    [HttpGet("DeleteMessage")]
    public IActionResult DeleteMessage()
    {
        return Ok("Successfully got messages");
    }
}