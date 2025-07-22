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
        // Checking certain paramters of userDto to make sure they're not null or empty
        if (string.IsNullOrEmpty(userDto.FirstName) || string.IsNullOrEmpty(userDto.LastName) || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Password))
        {
            return BadRequest("First name, last name, email and password are required.");
        }

        // Prevent duplicate emails
        var emailExists = await _context.Users.AnyAsync(u => u.Email == userDto.Email);
        if (emailExists)
        {
            return Conflict("Email is already registered.");
        }

        // Instantialized User object
        var user = new User
        {
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Email = userDto.Email,
            ProfileImage = userDto.ProfileImage
        };

        // Hashing the user's password for better security
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, userDto.Password);

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully");
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] UserLoginDto userRegisterDto)
    {
        // Making sure a user's login details are not null or empty strings
        if (string.IsNullOrEmpty(userRegisterDto.Email) || string.IsNullOrEmpty(userRegisterDto.Password))
        {
            return BadRequest("All fields are required.");
        }

        // Search for user using email and check if it exists
        var user = _context.Users.FirstOrDefault(u => u.Email == userRegisterDto.Email);
        if (user == null)
        {
            return Conflict("Invalid email");
        }

        // Checking if the hashed password matches the one in the database
        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, userRegisterDto.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return Conflict("Invalid email or password");
        }

        // Returning user info and a jwt
        return Ok(_jwtService.GenerateJwtToken(user.UserId.ToString()));
    }
}