using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/ProjectApplication")]

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

    [HttpGet("GetRecentApplications/{limit}")]
    public async Task<IActionResult> GetRecentApplications(int limit)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }

        var userId = int.Parse(userIdString);

        var userProjectIds = await _context.Projects
            .Where(p => p.OwnerId == userId)
            .Select(pm => pm.ProjectId)
            .ToListAsync();

        var applications = await _context.ProjectApplication
            .Include(pa => pa.User)
            .Include(pa => pa.Project)
            .Where(pa => userProjectIds.Contains(pa.ProjectId))
            .OrderByDescending(pa => pa.DateApplied)
            .Take(limit)
            .ToListAsync();

        var result = applications.Select(pa => new {
            applicantName = pa.User.FirstName + " " + pa.User.LastName,
            applicantImageUrl = pa.User.ProfileImage,
            projectName = pa.Project.Title,
            time = pa.DateApplied.ToString("yyyy-MM-dd HH:mm"),
            status = pa.Status,
            skills = pa.User.Skills ?? new List<string>()
        });

        return Ok(result);
    }

    [HttpPost("ApplyForProject/{projectId}")]
    public async Task<IActionResult> ApplyForProject([FromBody] ProjectApplicationDto projectApplicationDto, int projectId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var projectExists = await _context.Projects.AnyAsync(p => p.ProjectId == projectId);
        if (!projectExists)
        {
            return NotFound("Project not found");
        }

        var waitingListUser = new ProjectApplication
        {
            CoverMessage = projectApplicationDto.CoverMessage,
            Availablity = projectApplicationDto.Availability,
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