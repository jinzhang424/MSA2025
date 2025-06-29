using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("WaitingList")]

public class WaitingListController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpPut("ApplyForProject/{userId}/{projectId}")]
    public async Task<IActionResult> ApplyForProject(int userId, int projectId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
        {
            return Unauthorized("Unauthorized user");
        }

        var projectExists = await _context.ProjectWaitingList.AnyAsync(p => p.ProjectId == projectId);
        if (!projectExists)
        {
            return NotFound("Project not found");
        }

        var waitingListUser = new ProjectWaitingListUser
        {
            ProjectId = projectId,
            UserId = userId
        };

        await _context.ProjectWaitingListUser.AddAsync(waitingListUser);
        await _context.SaveChangesAsync();

        return Ok("Successfully applied to project");
    }

    [HttpDelete("RemoveProjectApplication/{userId}/{projectId}")]
    public async Task<IActionResult> RemoveProjectApplication(int userId, int projectId)
    {
        var waitingListUser = await _context.ProjectWaitingListUser
            .FirstOrDefaultAsync(pwu => pwu.UserId == userId && pwu.ProjectId == projectId);

        if (waitingListUser == null)
        {
            return NotFound("User or project was not found in waiting list");
        }

        _context.ProjectWaitingListUser.Remove(waitingListUser);
        await _context.SaveChangesAsync();

        return Ok("Successfully removed from project waiting list");
    }

    [HttpPut("RejectUserApplication/{userId}/{projectId}")]
    public async Task<IActionResult> RejectUserApplication(int userId, int projectId)
    {
        var waitingListUser = await _context.ProjectWaitingListUser
            .FirstOrDefaultAsync(pwu => pwu.UserId == userId && pwu.ProjectId == projectId);
        if (waitingListUser == null)
        {
            return NotFound("User not found in this project's waiting list");
        }

        _context.ProjectWaitingListUser.Remove(waitingListUser);
        await _context.SaveChangesAsync();
        
        return Ok("Successfully rejected user");
    }
}