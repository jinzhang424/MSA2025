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
                FirstName = u.FirstName,
                LastName = u.LastName,
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

    [HttpPatch("UpdateProfile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UserInfoDto userInfoDto)
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

        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, passwordDto.OldPassword);
        if (result == PasswordVerificationResult.Failed)
        {
            return BadRequest("Old password is incorrect");
        }

        user.PasswordHash = hasher.HashPassword(user, passwordDto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok("Successfully updated password");
    }


}