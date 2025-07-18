public class UserRegisterDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ProfileImage { get; set; } = null!;
}