using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("WaitingList")]

public class WaitingListController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    private async void RemoveUserFromWaitingList(int userId, int projectId)
    {
        var waitingListUser = await _context.ProjectWaitingListUser
            .FirstOrDefaultAsync(pwu => pwu.UserId == userId && pwu.ProjectId == projectId)
            ?? throw new Exception("User not found in this project's waiting list");

        _context.ProjectWaitingListUser.Remove(waitingListUser);
        await _context.SaveChangesAsync();
    }

    [HttpPut("ApplyForProject/{projectId}")]
    public async Task<IActionResult> ApplyForProject(int projectId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var projectExists = await _context.ProjectWaitingList.AnyAsync(p => p.ProjectId == projectId);
        if (!projectExists)
        {
            return NotFound("Project not found");
        }

        var waitingListUser = new ProjectWaitingListUser
        {
            ProjectId = projectId,
            UserId = int.Parse(userId)
        };

        await _context.ProjectWaitingListUser.AddAsync(waitingListUser);
        await _context.SaveChangesAsync();

        return Ok("Successfully applied to project");
    }

    [HttpDelete("RemoveProjectApplication/{projectId}")]
    public IActionResult RemoveProjectApplication(int projectId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid Token");
        }

        try
        {
            RemoveUserFromWaitingList(int.Parse(userId), projectId);
            return Ok("Successfully removed from project waiting list");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
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
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        return Ok("Successfully accepted user into project");
    }

    [HttpDelete("RejectUserApplication/{victimId}/{projectId}")]
    public async Task<IActionResult> RejectUserApplication(int victimId, int projectId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var projectMember = await _context.ProjectMmembers
            .FirstOrDefaultAsync(pm => pm.UserId == int.Parse(userId) && pm.ProjectId == projectId);
        if (projectMember == null || projectMember.Role != "Owner")
        {
            return Unauthorized("Only owners can reject applicants");
        }

        try
        {
            RemoveUserFromWaitingList(victimId, projectId);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
        
        return Ok("Successfully rejected user");
    }
}