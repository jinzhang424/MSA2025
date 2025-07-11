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
};