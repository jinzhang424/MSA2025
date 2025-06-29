public class ProjectWaitingList
{
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public ICollection<ProjectWaitingListUser> WaitingListUsers { get; set; } = []; 
}