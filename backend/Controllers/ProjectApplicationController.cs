using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/WaitingList")]

public class ApplicationController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    private async void RemoveUserApplication(int userId, int projectId)
    {
        var waitingListUser = await _context.ProjectApplication
            .FirstOrDefaultAsync(pwu => pwu.UserId == userId && pwu.ProjectId == projectId)
            ?? throw new Exception("User not found in this project's waiting list");

        _context.ProjectApplication.Remove(waitingListUser);
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

        var projectExists = await _context.ProjectApplication.AnyAsync(p => p.ProjectId == projectId);
        if (!projectExists)
        {
            return NotFound("Project not found");
        }

        var waitingListUser = new ProjectApplication
        {
            ProjectId = projectId,
            UserId = int.Parse(userId)
        };

        await _context.ProjectApplication.AddAsync(waitingListUser);
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
            RemoveUserApplication(int.Parse(userId), projectId);
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
        var projectApplication = await _context.ProjectApplication
            .AnyAsync(pwu => pwu.UserId == userId && pwu.ProjectId == projectId);
        if (!projectApplication)
        {
            return NotFound("User does not exist or has not applied to project");
        }

        var projectMember = new ProjectMember
        {
            ProjectId = projectId,
            UserId = userId
        };

        await _context.ProjectMembers.AddAsync(projectMember);
        _context.SaveChanges();

        // User no longer needs to be in waiting list and so it they can be removed
        try
        {
            RemoveUserApplication(userId, projectId);
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

        var projectMember = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.UserId == int.Parse(userId) && pm.ProjectId == projectId);
        if (projectMember == null || projectMember.Role != "Owner")
        {
            return Unauthorized("Only owners can reject applicants");
        }

        var projectApplication = await _context.ProjectApplication.FirstOrDefaultAsync(pa => pa.ProjectId == projectId);
        if (projectApplication == null)
        {
            return NotFound("Project not found");
        }

        projectApplication.Status = "Rejected";
        await _context.SaveChangesAsync();
        
        return Ok("Successfully rejected user");
    }
}