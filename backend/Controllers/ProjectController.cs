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
            ProjectTitle = projectDto.ProjectTitle,
            Description = projectDto.Description,
            Tags = projectDto.Tags,
            NumOfPositions = projectDto.NumOfPositions,
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

    [HttpGet("GetProject/{projectId}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            return NotFound("Project not found");
        }

        return Ok(project);
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

        var projectMember = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.UserId == int.Parse(userId));
        if (projectMember == null)
        {
            return NotFound("User not found");
        }
        else if (projectMember.Role != "Owner")
        {
            return Unauthorized("Only project owners can delete a project");
        }

        var project = await _context.Projects.FirstOrDefaultAsync();
        if (project == null)
        {
            return NotFound("Project not found.");
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

        project.ProjectTitle = projectDto.ProjectTitle ?? project.ProjectTitle;
        project.Description = projectDto.Description ?? project.Description;
        project.Tags = projectDto.Tags ?? project.Tags;
        project.NumOfPositions = projectDto.NumOfPositions ?? project.NumOfPositions;

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
}