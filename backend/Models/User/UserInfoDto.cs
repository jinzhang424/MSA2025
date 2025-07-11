public class UserInfoDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Bio { get; set; } = null!;
    public string Email { get; set; } = null!;

    public List<string> Skills { get; set; } = null!;
    public string ProfileImage { get; set; } = null!;
}