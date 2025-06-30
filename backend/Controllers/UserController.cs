using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("User")]
public class UserController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpGet("GetUserInfo")]
    public async Task<IActionResult> GetUserInfo()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var userInfo = await _context.Users
            .Where(u => u.UserId == int.Parse(userId))
            .Select(u => new UserInfoDto
            {
                Name = u.Name,
                Email = u.Email
            })
            .FirstOrDefaultAsync();

        return Ok(userInfo);
    }

    [HttpGet("DeleteUserInfo")]
    public async Task<IActionResult> DeleteUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == int.Parse(userId));
        if (user == null)
        {
            return NotFound("Account not found");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("Successfully deleted account");
    }
}