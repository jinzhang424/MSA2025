using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Service;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/User")]
public class UserController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpPatch("UpdateProfile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UserInfoDto userInfoDto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }
        var userId = int.Parse(userIdString);

        // Getting the user
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Update the details
        user.FirstName = userInfoDto.FirstName;
        user.LastName = userInfoDto.LastName;
        user.Bio = userInfoDto.Bio;
        user.Email = userInfoDto.Email;
        user.Skills = userInfoDto.Skills;
        user.ProfileImage = user.ProfileImage;

        await _context.SaveChangesAsync();

        return Ok("Successfully updated user profile");
    }

    [HttpPatch("UpdatePassword")]
    public async Task<IActionResult> UpdatePassword([FromBody] PasswordDto passwordDto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }
        var userId = int.Parse(userIdString);

        // Getting the user
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Verifying the password
        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, passwordDto.OldPassword);
        if (result == PasswordVerificationResult.Failed)
        {
            return BadRequest("Old password is incorrect");
        }

        // Hashing and udpating the password
        user.PasswordHash = hasher.HashPassword(user, passwordDto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok("Successfully updated password");
    }

    [HttpGet("GetUserProfile")]
    public async Task<IActionResult> GetUserProfile()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("Invalid Token");
        }
        var userId = int.Parse(userIdString);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        return Ok(new
        {
            id = user.UserId,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Bio,
            user.ProfileImage,
            user.Skills
        });
    }
}