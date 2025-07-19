using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/Notification")]
public class NotificationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("GetNotifications/{limit}")]
    public async Task<IActionResult> GetNotifications(int limit)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
            return Unauthorized("Invalid token");
        var userId = int.Parse(userIdString);

        var notifications = await _context.Notification
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .Select(n => new
            {
                id = n.Id,
                title = n.Title,
                content = n.Content,
                createdAt = n.CreatedAt,
                isRead = n.IsRead
            })
            .ToListAsync();

        return Ok(notifications);
    }
}