using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace BAAP.API.Hubs
{
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<string, UserConnection> _userConnections = new();
        private static readonly ConcurrentDictionary<string, List<string>> _assessmentGroups = new();

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

        // Enhanced methods for comprehensive real-time communication
        public async Task JoinAssessmentGroup(string assessmentId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"assessment_{assessmentId}");
            
            if (!_assessmentGroups.ContainsKey(assessmentId))
            {
                _assessmentGroups[assessmentId] = new List<string>();
            }
            
            _assessmentGroups[assessmentId].Add(Context.ConnectionId);
            
            await Clients.Group($"assessment_{assessmentId}").SendAsync("UserJoinedAssessment", new
            {
                UserId = GetUserId(),
                UserName = GetUserName(),
                AssessmentId = assessmentId,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task LeaveAssessmentGroup(string assessmentId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"assessment_{assessmentId}");
            
            if (_assessmentGroups.ContainsKey(assessmentId))
            {
                _assessmentGroups[assessmentId].Remove(Context.ConnectionId);
            }
            
            await Clients.Group($"assessment_{assessmentId}").SendAsync("UserLeftAssessment", new
            {
                UserId = GetUserId(),
                UserName = GetUserName(),
                AssessmentId = assessmentId,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendAlertToAssessment(string assessmentId, object alert)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("ReceiveAlert", alert);
        }

        public async Task AcknowledgeAlert(string alertId, string assessmentId)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("AlertAcknowledged", new
            {
                AlertId = alertId,
                AcknowledgedBy = GetUserId(),
                AcknowledgedByName = GetUserName(),
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task AddAlertComment(string alertId, string assessmentId, string comment)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("AlertCommentAdded", new
            {
                AlertId = alertId,
                Comment = comment,
                Author = GetUserId(),
                AuthorName = GetUserName(),
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendDashboardUpdate(string assessmentId, string dashboardType, object data)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("DashboardUpdate", new
            {
                DashboardType = dashboardType,
                Data = data,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendRecommendationUpdate(string assessmentId, object recommendation)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("RecommendationUpdate", new
            {
                Recommendation = recommendation,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendProgressUpdate(string assessmentId, string stage, double percentage, string? message = null)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("ProgressUpdate", new
            {
                AssessmentId = assessmentId,
                Stage = stage,
                Percentage = percentage,
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendCostAnalysisUpdate(string assessmentId, object costData)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("CostAnalysisUpdate", new
            {
                AssessmentId = assessmentId,
                CostData = costData,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendRiskAssessmentUpdate(string assessmentId, object riskData)
        {
            await Clients.Group($"assessment_{assessmentId}").SendAsync("RiskAssessmentUpdate", new
            {
                AssessmentId = assessmentId,
                RiskData = riskData,
                Timestamp = DateTime.UtcNow
            });
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            var userName = GetUserName();
            
            _userConnections.TryAdd(Context.ConnectionId, new UserConnection
            {
                ConnectionId = Context.ConnectionId,
                UserId = userId,
                UserName = userName,
                ConnectedAt = DateTime.UtcNow
            });

            await Clients.All.SendAsync("UserConnected", new
            {
                UserId = userId,
                UserName = userName,
                ConnectionId = Context.ConnectionId,
                Timestamp = DateTime.UtcNow
            });

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            var userName = GetUserName();
            
            _userConnections.TryRemove(Context.ConnectionId, out _);

            // Remove from all assessment groups
            foreach (var group in _assessmentGroups.Values)
            {
                group.Remove(Context.ConnectionId);
            }

            await Clients.All.SendAsync("UserDisconnected", new
            {
                UserId = userId,
                UserName = userName,
                ConnectionId = Context.ConnectionId,
                Timestamp = DateTime.UtcNow
            });

            await base.OnDisconnectedAsync(exception);
        }

        public async Task GetConnectedUsers()
        {
            var users = _userConnections.Values.Select(uc => new
            {
                uc.UserId,
                uc.UserName,
                uc.ConnectedAt
            });

            await Clients.Caller.SendAsync("ConnectedUsers", users);
        }

        private string GetUserId()
        {
            return Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Context.ConnectionId;
        }

        private string GetUserName()
        {
            return Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Anonymous";
        }
    }

    public class UserConnection
    {
        public string ConnectionId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public DateTime ConnectedAt { get; set; }
    }
}
