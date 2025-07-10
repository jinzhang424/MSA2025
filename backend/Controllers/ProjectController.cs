using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Service;

namespace backend.Controllers;

[ApiController]
[Route("api/Project")]

public class ProjectController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtService;

    public ProjectController(ApplicationDbContext context, JwtTokenService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

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

        var chatroom = new Chatroom
        {
            Name = projectDto.Title,
            ProjectId = project.ProjectId,
            OwnerId = userId
        };

        await _context.Chatrooms.AddAsync(chatroom);
        await _context.SaveChangesAsync();

        var chatroomUser = new ChatroomUser
        {
            UserId = userId,
            ChatroomId = chatroom.ChatroomId
        };

        await _context.ChatroomUser.AddAsync(chatroomUser);
        await _context.SaveChangesAsync();

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

        var result = new
        {
            title = project.Title,
            description = project.Description,
            imageUrl = project.ImageUrl ?? "",
            category = project.Category,
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

        var project = await _context.Projects.FirstOrDefaultAsync();
        if (project == null)
        {
            return NotFound("Project not found.");
        }

        if (project.OwnerId != int.Parse(userId))
        {
            return Unauthorized("Insufficient Permissions. Need to be role: Owner");
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return Ok("Successfully removed project");
    }

    [Authorize]
    [HttpDelete("RemoveUserFromProject/{victimId}/{projectId}")]
    public async Task<IActionResult> RemoveUserFromProject(int victimId, int projectId)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid token.");
        }
        int userId = int.Parse(userIdString);

        // Get the project and check if the current user is the owner
        var project = await _context.Projects
            .Include(p => p.ProjectMembers)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);

        if (project == null)
        {
            return NotFound("Project not found.");
        }

        if (victimId != userId && project.OwnerId != userId)
        {
            return Unauthorized("Only the project owner can remove other members.");
        }

        // Prevent owner from removing themselves
        if (victimId == project.OwnerId)
        {
            return BadRequest("Owner cannot remove themselves from the project.");
        }

        // Find the project member to remove
        var member = project.ProjectMembers.FirstOrDefault(pm => pm.UserId == victimId);
        if (member == null)
        {
            return NotFound("User is not a member of this project.");
        }

        _context.ProjectMembers.Remove(member);
        await _context.SaveChangesAsync();

        return Ok("User successfully removed from project.");
    }


    [Authorize]
    [HttpPatch("UpdateProjectDetails/{projectId}")]
    public async Task<IActionResult> UpdateProjectDetails([FromBody] ProjectDto projectDto, int projectId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid Token");
        }

        var projectMember = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == int.Parse(userId));
        if (projectMember == null)
        {
            return NotFound("User was is not part of project");
        }
        else if (projectMember.Role != "Owner")
        {
            return Unauthorized("User must be owner to remove this project");
        }

        var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            return NotFound("Project not found");
        }

        project.Title = projectDto.Title ?? project.Title;
        project.Description = projectDto.Description ?? project.Description;
        project.Skills = projectDto.Skills ?? project.Skills;
        project.TotalSpots = projectDto.TotalSpots;
        project.Duration = projectDto.Duration;

        await _context.SaveChangesAsync();
        return Ok("Successfully updated project details.");
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
        var projects = await _context.Projects
            .Where(p => p.OwnerId == userId)
            .Include(p => p.ProjectMembers)
            .ToListAsync();

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
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }

        var userId = int.Parse(userIdString);
        var projects = await _context.Projects
            .Where(p => p.OwnerId != userId) // Stops the user from seeing their own project in the discovery
            .Include(p => p.ProjectMembers)
            .ToListAsync();

        var result = projects.Select(project => new
        {
            projectId = project.ProjectId,
            title = project.Title,
            description = project.Description,
            image = project.ImageUrl,
            category = project.Category,
            spotsAvailable = project.ProjectMembers?.Count ?? 0,
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
        var project = await _context.Projects
            .Include(p => p.ProjectMembers)
                .ThenInclude(pm => pm.User)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);

        if (project == null)
        {
            return NotFound("Project not found");
        }

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