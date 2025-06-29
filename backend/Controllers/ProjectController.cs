using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("Project")]

public class ProjectController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("CreateProject/{userId}")]
    public async Task<IActionResult> CreateProject([FromBody] ProjectDto projectDto, int userId)
    {
        // Prevent unauthorized users from creating a project
        var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
        if (!userExists)
        {
            return NotFound("User not found.");
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
            UserId = userId,
            ProjectId = project.ProjectId
        };

        await _context.ProjectMmembers.AddAsync(projectMember);
        await _context.SaveChangesAsync();

        return Ok("Project successfully created.");
    }

    [HttpGet("GetAllProjects")]
    public async Task<IActionResult> GetAllProjects()
    {
        var projects = await _context.Projects.ToListAsync();
        return Ok(projects);
    }

    [HttpDelete("DeleteProject/{projectId}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        var project = await _context.Projects.FirstOrDefaultAsync();
        if (project == null)
        {
            return NotFound("Project not found.");
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return Ok("Successfully removed project");
    }

    [HttpPatch("UpdateProjectDetails/{projectId}")]
    public async Task<IActionResult> UpdateProjectDetails([FromBody] ProjectDto projectDto, int projectId)
    {
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
}