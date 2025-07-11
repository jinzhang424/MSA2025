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

    // Get unread notifications, newest first
    [HttpGet("GetUnreadNotifications")]
    public async Task<IActionResult> GetUnreadNotifications()
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
            return Unauthorized("Invalid token");
        var userId = int.Parse(userIdString);

        var notifications = await _context.Notification
            .Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpPatch("MarkAsRead/{notificationId}")]
    public async Task<IActionResult> MarkAsRead(int notificationId)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
            return Unauthorized("Invalid token");
        var userId = int.Parse(userIdString);

        var notification = await _context.Notification
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

        if (notification == null)
            return NotFound("Notification not found");

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok("Notification marked as read");
    }
}