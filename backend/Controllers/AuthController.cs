using backend.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/Auth")]

public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtService;

    public AuthController(ApplicationDbContext context, JwtTokenService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("RegisterUser")]
    public async Task<IActionResult> RegisterUser([FromBody] UserRegisterDto userDto)
    {
        if (string.IsNullOrEmpty(userDto.FirstName) || string.IsNullOrEmpty(userDto.LastName) || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Password))
        {
            return BadRequest("All fields are required.");
        }

        var emailExists = await _context.Users.AnyAsync(u => u.Email == userDto.Email);
        if (emailExists)
        {
            return Conflict("Email is already registered.");
        }

        var user = new User
        {
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Email = userDto.Email,
        };

        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, userDto.Password);

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully");
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] UserLoginDto userRegisterDto)
    {
        if (string.IsNullOrEmpty(userRegisterDto.Email) || string.IsNullOrEmpty(userRegisterDto.Password))
        {
            return BadRequest("All fields are required.");
        }

        var user = _context.Users.FirstOrDefault(u => u.Email == userRegisterDto.Email);

        if (user == null)
        {
            return Conflict("Invalid email");
        }

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, userRegisterDto.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return Conflict("Invalid email or password");
        }

        return Ok(new {
            id = user.UserId,
            firstName = user.FirstName,
            lastName = user.LastName,
            email = user.Email,
            bio = user.Bio,
            token = _jwtService.GenerateJwtToken(user.UserId.ToString()),
            skills = user.Skills
        });
    }
}