using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/ProjectApplication")]

public class ApplicationController(ApplicationDbContext context, NotificationService notificationService, ChatroomService chatroomService) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly NotificationService _notificationService = notificationService;
    private readonly ChatroomService _chatroomService = chatroomService;

    private async void RemoveUserApplication(int userId, int projectId)
    {
        // Ensuring the project application exists
        var projectApplication = await _context.ProjectApplication
            .FirstOrDefaultAsync(pa => pa.UserId == userId && pa.ProjectId == projectId)
            ?? throw new Exception("User not found in this project's waiting list");

        _context.ProjectApplication.Remove(projectApplication);
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

        // Getting the applications recent applications and only taking the limit amount 
        var applications = await _context.ProjectApplication
            .Include(pa => pa.User)
            .Include(pa => pa.Project)
            .Where(pa => pa.UserId == userId)
            .OrderByDescending(pa => pa.DateApplied)
            .Take(limit)
            .ToListAsync();

        // Returning them in the expected structure
        var result = applications.Select(pa => new
        {
            applicantName = pa.User.FirstName + " " + pa.User.LastName,
            projectImageUrl = pa.Project.ImageUrl,
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
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid token");
        }
        var userId = int.Parse(userIdString);

        // Ensure that the project exists
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            return NotFound("Project not found");
        }

        // Ensure that the user exists
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Prevent users from applying if they've already applied
        var existingApplication = await _context.ProjectApplication
            .AnyAsync(pa => pa.ProjectId == projectId && pa.UserId == userId);
        if (existingApplication)
        {
            return Conflict("You have already applied for this project.");
        }

        // Creating the application
        var waitingListUser = new ProjectApplication
        {
            CoverMessage = projectApplicationDto.CoverMessage,
            Availablity = projectApplicationDto.Availability,
            ProjectId = projectId,
            UserId = userId
        };

        await _context.ProjectApplication.AddAsync(waitingListUser);
        await _context.SaveChangesAsync();

        return Ok("Successfully applied to project");
    }

    [HttpPut("AcceptUserApplication/{applicantId}/{projectId}")]
    public async Task<IActionResult> AcceptUserApplication(int applicantId, int projectId)
    {
        var project = await _context.Projects
            .Include(p => p.Chatroom)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            return NotFound("Project was not found");
        }

        // Check if the applicant has actually applied to the project
        var projectApplication = await _context.ProjectApplication
            .FirstOrDefaultAsync(pwu => pwu.UserId == applicantId && pwu.ProjectId == projectId);
        if (projectApplication == null)
        {
            return NotFound("User does not exist or has not applied to project");
        }

        var projectMember = new ProjectMember
        {
            ProjectId = projectId,
            UserId = applicantId
        };

        await _context.ProjectMembers.AddAsync(projectMember);
        projectApplication.Status = "Accepted";

        // Adding user to project chatroom
        await _chatroomService.AddUser(project.Chatroom.ChatroomId, applicantId);

        await _notificationService.ApplicationDecisionNotification(applicantId, project.Title, true);

        return Ok("Successfully accepted user into project");
    }

    [HttpPatch("RejectUserApplication/{applicantId}/{projectId}")]
    public async Task<IActionResult> RejectUserApplication(int applicantId, int projectId)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid token");
        }
        var userId = int.Parse(userIdString);

        // Prevent unauthorized users from rejecting application
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == projectId && p.OwnerId == userId);
        if (project == null)
        {
            return Unauthorized("Only owners can reject applicants");
        }

        // Searching for project and ensure that it exists
        var projectApplication = await _context.ProjectApplication
            .FirstOrDefaultAsync(pa => pa.ProjectId == projectId && pa.UserId == applicantId);
        if (projectApplication == null)
        {
            return NotFound("Project applicantion not found");
        }

        projectApplication.Status = "Rejected";
        await _context.SaveChangesAsync();

        // Sending the notification to the user that they have been rejected
        await _notificationService.ApplicationDecisionNotification(applicantId, project.Title, false);

        return Ok("Successfully rejected user");
    }

    [Authorize]
    [HttpGet("GetProjectPendingApplications/{projectId}")]
    public async Task<IActionResult> GetProjectPendingApplications(int projectId)
    {
        var project = await _context.Projects
            .Include(p => p.ProjectApplications)
            .ThenInclude(pa => pa.User)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);

        if (project == null)
        {
            return NotFound("Project not found");
        }

        // Getting pending applications and adjusting return structure for frontend
        var result = project.ProjectApplications
            .Where(pa => pa.Status == "Pending")
            .Select(pa => new
            {
                userId = pa.User.UserId,
                firstName = pa.User.FirstName,
                lastName = pa.User.LastName,
                email = pa.User.Email,
                skills = pa.User.Skills ?? new List<string>(),
                dateApplied = pa.DateApplied.ToString("yyyy-MM-dd HH:mm"),
                message = pa.CoverMessage,
                status = pa.Status
            }).ToList();

        return Ok(result);
    }

    [Authorize]
    [HttpGet("GetOutgoingApplications")]
    public async Task<IActionResult> GetOutgoingApplications()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }

        int userId = int.Parse(userIdString);

        // Getting all outgoing applications
        var applications = await _context.ProjectApplication
            .Include(pa => pa.Project)
            .Where(pa => pa.UserId == userId)
            .OrderByDescending(pa => pa.DateApplied)
            .ToListAsync();

        // Structuring results for frontend
        var result = applications.Select(pa => new
        {
            projectId = pa.ProjectId,
            title = pa.Project.Title,
            description = pa.Project.Description,
            image = pa.Project.ImageUrl,
            dateApplied = pa.DateApplied.ToString("yyyy-MM-dd"),
            skills = pa.Project.Skills ?? new List<string>(),
            status = pa.Status,
            coverMessage = pa.CoverMessage
        }).ToList();

        return Ok(result);
    }

    [Authorize]
    [HttpGet("GetIncomingApplications")]
    public async Task<IActionResult> GetIncomingApplications()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }

        int userId = int.Parse(userIdString);

        // Get all project IDs owned by the current user
        var ownedProjectIds = await _context.Projects
            .Where(p => p.OwnerId == userId)
            .Select(p => p.ProjectId)
            .ToListAsync();

        // Get all applications to those projects
        var applications = await _context.ProjectApplication
            .Include(pa => pa.User)
            .Include(pa => pa.Project)
            .Where(pa => ownedProjectIds.Contains(pa.ProjectId) && pa.Status == "Pending")
            .OrderByDescending(pa => pa.DateApplied)
            .ToListAsync();

        // Structuring them for frontend
        var result = applications.Select(pa => new
        {
            applicant = new
            {
                userId = pa.User.UserId,
                firstName = pa.User.FirstName,
                lastName = pa.User.LastName,
                email = pa.User.Email,
                profilePicture = pa.User.ProfileImage,
                skills = pa.User.Skills ?? new List<string>()
            },
            projectId = pa.ProjectId,
            projectTitle = pa.Project.Title,
            status = pa.Status,
            dateApplied = pa.DateApplied.ToString("yyyy-MM-dd"),
            coverMessage = pa.CoverMessage
        }).ToList();

        return Ok(result);
    }
}