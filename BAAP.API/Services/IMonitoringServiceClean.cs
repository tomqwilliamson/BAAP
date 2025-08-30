using BAAP.API.Models;
using BAAP.API.Hubs;
using BAAP.API.Data;
using Microsoft.AspNetCore.SignalR;

namespace BAAP.API.Services;

public interface IMonitoringServiceClean
{
    Task<MonitoringDashboard> GetDashboardAsync(string assessmentId, DashboardType dashboardType);
    Task<List<AlertNotification>> GetActiveAlertsAsync(string assessmentId);
    Task<List<AlertNotification>> GetActiveAlertsAsync(); // Global alerts
    Task<List<object>> GetKpisAsync(string period); // KPI data
    Task<List<PerformanceMetric>> GetPerformanceMetricsAsync(string assessmentId, TimeSpan period);
    Task<SystemHealthStatus> GetSystemHealthAsync(string assessmentId);
    Task CreateAlertAsync(string assessmentId, AlertNotification alert);
    Task AcknowledgeAlertAsync(string alertId, string userId);
}