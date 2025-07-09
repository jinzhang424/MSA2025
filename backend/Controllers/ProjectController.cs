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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token.");
        }

        var project = new Project
        {
            Title = projectDto.Title,
            Description = projectDto.Description,
            Skills = projectDto.Skills,
            TotalSpots = projectDto.TotalSpots,
            Category = projectDto.Category,
            ImageUrl = projectDto.Imageurl,
            Duration = projectDto.Duration,
            OwnerId = int.Parse(userId)
        };

        await _context.Projects.AddAsync(project);
        await _context.SaveChangesAsync();

        var projectMember = new ProjectMember
        {
            Role = "Owner",
            UserId = int.Parse(userId),
            ProjectId = project.ProjectId
        };

        await _context.ProjectMembers.AddAsync(projectMember);
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
        var teamLead = teamLeadMember != null ? new {
            firstName = teamLeadMember.User.FirstName,
            lastName = teamLeadMember.User.LastName,
            image = teamLeadMember.User.ProfileImage ?? null,
            role = "Owner"
        } : null;

        // Find team members (exclude owner)
        var teamMembers = project.ProjectMembers
            .Where(pm => pm.Role != "Owner")
            .Select(pm => new {
                firstName = pm.User.FirstName,
                lastName = pm.User.LastName,
                image = pm.User.ProfileImage ?? null,
                role = pm.Role
            }).ToList();

        var result = new {
            title = project.Title,
            description = project.Description,
            imageUrl = project.ImageUrl ?? "",
            category = project.Category,
            totalSpots = project.TotalSpots,
            skills = project.Skills ?? new List<string>(),
            teamLead = teamLead,
            teamMembers = teamMembers,
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

        if (project.OwnerId != int.Parse(userId)) {
            return Unauthorized("Insufficient Permissions. Need to be role: Owner");
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return Ok("Successfully removed project");
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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            return Unauthorized("Invalid Token");
        }

        var projects = await _context.ProjectMembers
            .Where(pm => pm.UserId.ToString() == userId)
            .Select(pm => pm.Project)
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("GetAllProjectsCardData")]
    public async Task<IActionResult> GetAllProjectsCardData()
    {
        var projects = await _context.Projects.ToListAsync();
        var result = projects.Select(project => new {
            projectId = project.ProjectId,
            title = project.Title,
            description = project.Description,
            image = project.ImageUrl,
            category = project.Category,
            availableSpots = project.TotalSpots, // Assuming availableSpots = TotalSpots
            duration = project.Duration,
            skills = project.Skills ?? new List<string>()
        }).ToList();
        return Ok(result);
    }
}