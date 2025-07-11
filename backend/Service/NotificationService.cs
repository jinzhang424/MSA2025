using Microsoft.AspNetCore.Mvc;

public class NotificationService(ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;

    public async Task ApplicationDecisionNotification(int userId, string projectTitle, bool accepted)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = accepted ? "Application Accepted" : "Application Rejected",
            Content = accepted
                ? $"Your application for project '{projectTitle}' has been accepted."
                : $"Your application for project '{projectTitle}' has been rejected.",

            Type = accepted ? "ApplicationAccepted" : "ApplicationRejected",
            CreatedAt = DateTime.UtcNow
        };
        _context.Notification.Add(notification);
        await _context.SaveChangesAsync();
    }

    public async Task SubmitApplicationNotification(int ownerId, string applicantName, string projectTitle)
    {
        var notification = new Notification
        {
            UserId = ownerId,
            Title = "New Project Application",
            Content = $"{applicantName} has applied to your project '{projectTitle}'.",
            Type = "NewApplication",
            CreatedAt = DateTime.UtcNow
        };
        _context.Notification.Add(notification);
        await _context.SaveChangesAsync();
    }
};