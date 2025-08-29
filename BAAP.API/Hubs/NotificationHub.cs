using Microsoft.AspNetCore.SignalR;

namespace BAAP.API.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendAnalysisNotification(string module, string? assessmentName = null, string? duration = null)
        {
            await Clients.All.SendAsync("ReceiveNotification", new
            {
                Type = "analysis",
                Module = module,
                AssessmentName = assessmentName,
                Duration = duration,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendSystemNotification(string title, string message, string type = "system")
        {
            await Clients.All.SendAsync("ReceiveNotification", new
            {
                Type = type,
                Title = title,
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
