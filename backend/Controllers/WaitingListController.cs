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

    public async void RemoveUserFromWaitingList(int userId, int projectId)
    {
        var waitingListUser = await _context.ProjectWaitingListUser
            .FirstOrDefaultAsync(pwu => pwu.UserId == userId && pwu.ProjectId == projectId)
            ?? throw new Exception("User not found in this project's waiting list");

        _context.ProjectWaitingListUser.Remove(waitingListUser);
        await _context.SaveChangesAsync();
    }

    [HttpPut("AcceptUserApplication/{userId}/{projectId}")]
    public async Task<IActionResult> AcceptUserApplication(int userId, int projectId)
    {
        // Check if the user has applied to the project
        var projectWaitingListUser = await _context.ProjectWaitingListUser
            .AnyAsync(pwu => pwu.UserId == userId && pwu.ProjectId == projectId);
        if (!projectWaitingListUser)
        {
            return NotFound("User does not exist or was not part of the waiting list");
        }

        var projectMember = new ProjectMember
        {
            ProjectId = projectId,
            UserId = userId
        };

        await _context.ProjectMmembers.AddAsync(projectMember);
        _context.SaveChanges();

        // User no longer needs to be in waiting list and so it they can be removed
        try
        {
            RemoveUserFromWaitingList(userId, projectId);
        }
        catch
        {
            return NotFound("User not found in this project's waiting list");
        }

        return Ok("Successfully accepted user into project");
    }

    [HttpDelete("RejectUserApplication/{userId}/{projectId}")]
    public IActionResult RejectUserApplication(int userId, int projectId)
    {
        try
        {
            RemoveUserFromWaitingList(userId, projectId);
        }
        catch 
        {
            return NotFound("User not found in this project's waiting list");
        }
        
        return Ok("Successfully rejected user");
    }
}