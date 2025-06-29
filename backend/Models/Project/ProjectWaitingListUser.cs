public class ProjectWaitingListUser
{
    public int ProjectId { get; set; }
    public ProjectWaitingList ProjectWaitingList { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}