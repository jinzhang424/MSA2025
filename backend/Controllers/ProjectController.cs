using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Service;

namespace backend.Controllers;

[ApiController]
[Route("api/Project")]

public class ProjectController(ApplicationDbContext context, JwtTokenService jwtService, ChatroomService chatroomService) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly JwtTokenService _jwtService = jwtService;
    private readonly ChatroomService _chatroomService = chatroomService;

    [Authorize]
    [HttpPost("CreateProject")]
    public async Task<IActionResult> CreateProject([FromBody] ProjectDto projectDto)
    {
        // Prevent unauthorized users from creating a project
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid token.");
        }
        var userId = int.Parse(userIdString);

        var project = new Project
        {
            Title = projectDto.Title,
            Description = projectDto.Description,
            Skills = projectDto.Skills,
            TotalSpots = projectDto.TotalSpots,
            Category = projectDto.Category,
            ImageUrl = projectDto.Imageurl,
            Duration = projectDto.Duration,
            OwnerId = userId
        };

        // Adding the creator to project
        await _context.Projects.AddAsync(project);
        await _context.SaveChangesAsync();

        var projectMember = new ProjectMember
        {
            Role = "Owner",
            UserId = userId,
            ProjectId = project.ProjectId
        };

        await _context.ProjectMembers.AddAsync(projectMember);
        await _context.SaveChangesAsync();

        // Creating a chatroom for the project
        await _chatroomService.CreateChatroom(projectDto.Title, project.ProjectId, userId, true);

        return Ok("Project successfully created.");
    }

    [HttpGet("GetAllProjects")]
    public async Task<IActionResult> GetAllProjects()
    {
        var projects = await _context.Projects.ToListAsync();
        return Ok(projects);
    }

    [HttpGet("GetProjectPageData/{projectId}")]
    public async Task<IActionResult> GetProjectPageData(int projectId)
    {
        // Getting project and ensuring it exists
        var project = await _context.Projects
            .Include(p => p.ProjectMembers)
                .ThenInclude(pm => pm.User)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            return NotFound("Project not found");
        }

        // Find the team lead (owner)
        var teamLeadMember = project.ProjectMembers.FirstOrDefault(pm => pm.Role == "Owner");
        var teamLead = teamLeadMember != null ? new
        {
            firstName = teamLeadMember.User.FirstName,
            lastName = teamLeadMember.User.LastName,
            image = teamLeadMember.User.ProfileImage ?? null,
            role = "Owner"
        } : null;

        // Find team members (exclude owner)
        var teamMembers = project.ProjectMembers
            .Where(pm => pm.Role != "Owner")
            .Select(pm => new
            {
                firstName = pm.User.FirstName,
                lastName = pm.User.LastName,
                image = pm.User.ProfileImage ?? null,
                role = pm.Role
            }).ToList();

        // Structuring return value
        var result = new
        {
            title = project.Title,
            description = project.Description,
            imageUrl = project.ImageUrl ?? "",
            category = project.Category,
            spotsTaken = project.ProjectMembers.Count(),
            totalSpots = project.TotalSpots,
            skills = project.Skills ?? new List<string>(),
            teamLead,
            teamMembers,
            duration = project.Duration ?? ""
        };

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("DeleteProject/{projectId}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token.");
        }

        // Finding project
        var project = await _context.Projects.FirstOrDefaultAsync();
        if (project == null)
        {
            return NotFound("Project not found.");
        }
        
        // Prevent non-owners from deleting the project
        if (project.OwnerId != int.Parse(userId))
        {
            return Unauthorized("Insufficient Permissions. Need to be role: Owner");
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return Ok("Successfully removed project");
    }

    [Authorize]
    [HttpGet("GetAllUserProjects")]
    public async Task<IActionResult> GetAllUserProjects()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }
        var userId = int.Parse(userIdString);

        // Getting projects where user is owner
        var projects = await _context.Projects
            .Where(p => p.OwnerId == userId)
            .Include(p => p.ProjectMembers)
            .ToListAsync();

        // Structuring results for frontend
        var result = projects.Select(project => new
        {
            projectId = project.ProjectId,
            title = project.Title,
            description = project.Description,
            image = project.ImageUrl,
            category = project.Category,
            spotsTaken = project.ProjectMembers?.Count ?? 0,
            totalSpots = project.TotalSpots,
            duration = project.Duration,
            skills = project.Skills ?? new List<string>(),
            status = project.Status
        }).ToList();
        return Ok(result);
    }

    [HttpGet("GetAllProjectsCardData")]
    public async Task<IActionResult> GetAllProjectsCardData()
    {
        // Getting all projects
        var projects = await _context.Projects
            .Where(p => p.Status == "Active")
            .Include(p => p.ProjectMembers)
            .ToListAsync();
        
        // Structuring results for frontend 
        var result = projects.Select(project => new
        {
            projectId = project.ProjectId,
            title = project.Title,
            description = project.Description,
            image = project.ImageUrl,
            category = project.Category,
            spotsTaken = project.ProjectMembers?.Count ?? 0,
            totalSpots = project.TotalSpots,
            duration = project.Duration,
            skills = project.Skills ?? new List<string>()
        }).ToList();
        return Ok(result);
    }

    [HttpGet("GetUserStats")]
    public async Task<IActionResult> GetUserStats()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid token");
        }
        int userId = int.Parse(userIdString);

        // My projects (owned)
        var myProjects = await _context.Projects.CountAsync(p => p.OwnerId == userId);

        // Joined projects (not owner, but member)
        var joinedProjects = await _context.ProjectMembers.CountAsync(pm => pm.UserId == userId && pm.Role != "Owner");

        // Pending applications (applications with status 'Pending')
        var pendingApplications = await _context.ProjectApplication.CountAsync(pa => pa.UserId == userId && pa.Status == "Pending");

        // Completed projects (owned or joined, with status 'Completed')
        var completedProjects = await _context.Projects.CountAsync(p => (p.OwnerId == userId || p.ProjectMembers.Any(pm => pm.UserId == userId)) && p.Status == "Completed");

        return Ok(new
        {
            myProjects,
            joinedProjects,
            pendingApplications,
            completedProjects
        });
    }

    [Authorize]
    [HttpGet("GetProjectMembers/{projectId}")]
    public async Task<IActionResult> GetProjectMembers(int projectId)
    {
        // Find the project
        var project = await _context.Projects
            .Include(p => p.ProjectMembers)
                .ThenInclude(pm => pm.User)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            return NotFound("Project not found");
        }

        // Getting all members of project and structuring results for frontend
        var result = project.ProjectMembers.Select(pm => new
        {
            projectId = project.ProjectId,
            userId = pm.UserId,
            user = new
            {
                id = pm.User.UserId,
                firstName = pm.User.FirstName,
                lastName = pm.User.LastName,
                email = pm.User.Email,
                bio = pm.User.Bio,
                skills = pm.User.Skills ?? new List<string>()
            },
            role = pm.Role,
            joinedAt = pm.JoinedAt.ToString("yyyy-MM-dd HH:mm")
        }).ToList();

        return Ok(result);
    }
    
    [Authorize]
    [HttpGet("GetJoinedProjects")]
    public async Task<IActionResult> GetJoinedProjects()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid token");
        }
        int userId = int.Parse(userIdString);

        // Get all ProjectMembers for this user (excluding projects where they are the owner, if you want)
        var joinedProjectMembers = await _context.ProjectMembers
            .Include(pm => pm.Project)
            .ThenInclude(p => p.ProjectMembers)
            .Where(pm => pm.UserId == userId && pm.Role != "Owner")
            .ToListAsync();

        // Structuring results for frontend
        var result = joinedProjectMembers.Select(pm => new
        {
            projectId = pm.Project.ProjectId,
            title = pm.Project.Title,
            description = pm.Project.Description,
            image = pm.Project.ImageUrl,
            category = pm.Project.Category,
            spotsTaken = pm.Project.ProjectMembers.Count,
            totalSpots = pm.Project.TotalSpots,
            skills = pm.Project.Skills,
            status = pm.Project.Status,
            role = pm.Role
        }).ToList();

        return Ok(result);
    }
}