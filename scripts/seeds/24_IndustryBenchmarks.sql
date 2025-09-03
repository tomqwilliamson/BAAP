-- Seed data for IndustryBenchmarks table (Phase 4)
PRINT 'Seeding IndustryBenchmarks table...'

-- Set identity insert on to specify explicit IDs
SET IDENTITY_INSERT IndustryBenchmarks ON;

INSERT INTO IndustryBenchmarks (
    Id,
    IndustryClassificationId,
    MetricName,
    MetricCategory,
    BenchmarkValue,
    Unit,
    PercentileData,
    DataSource,
    SampleSize,
    LastUpdated,
    ValidUntil
) VALUES
-- E-commerce & Retail (ID: 1) Benchmarks
(1, 1, 'Cloud Adoption Rate', 'Performance', 78.5, 'percentage', '{"P25": 65.0, "P50": 78.5, "P75": 85.0, "P90": 92.0}', 'Industry Survey 2024', 450, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(2, 1, 'Mobile Traffic Percentage', 'Performance', 68.2, 'percentage', '{"P25": 55.0, "P50": 68.2, "P75": 75.0, "P90": 82.0}', 'E-commerce Analytics Report', 1200, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(3, 1, 'Average Page Load Time', 'Performance', 2.8, 'seconds', '{"P25": 2.2, "P50": 2.8, "P75": 3.5, "P90": 4.2}', 'Web Performance Study', 800, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(4, 1, 'Cart Abandonment Rate', 'Performance', 67.4, 'percentage', '{"P25": 65.0, "P50": 67.4, "P75": 72.0, "P90": 78.0}', 'Conversion Optimization Study', 950, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(5, 1, 'Security Incidents per Year', 'Security', 3.2, 'incidents', '{"P25": 1.0, "P50": 3.2, "P75": 5.0, "P90": 8.0}', 'Cybersecurity Report', 320, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(6, 1, 'Cloud Infrastructure Cost', 'Cost', 15.8, 'percentage_of_revenue', '{"P25": 12.0, "P50": 15.8, "P75": 19.0, "P90": 24.0}', 'Cost Optimization Survey', 280, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),

-- Financial Services (ID: 2) Benchmarks
(7, 2, 'Cloud Adoption Rate', 'Performance', 65.2, 'percentage', '{"P25": 45.0, "P50": 65.2, "P75": 75.0, "P90": 85.0}', 'Financial Services Cloud Survey', 380, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(8, 2, 'System Uptime', 'Performance', 99.95, 'percentage', '{"P25": 99.85, "P50": 99.95, "P75": 99.98, "P90": 99.99}', 'Financial IT Reliability Study', 150, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(9, 2, 'Compliance Audit Score', 'Compliance', 87.3, 'percentage', '{"P25": 78.0, "P50": 87.3, "P75": 92.0, "P90": 96.0}', 'Regulatory Compliance Report', 220, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(10, 2, 'Cybersecurity Investment', 'Security', 8.5, 'percentage_of_it_budget', '{"P25": 6.0, "P50": 8.5, "P75": 11.0, "P90": 15.0}', 'Financial Security Investment Survey', 290, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(11, 2, 'Digital Transaction Processing Time', 'Performance', 1.2, 'seconds', '{"P25": 0.8, "P50": 1.2, "P75": 1.8, "P90": 2.5}', 'Transaction Performance Study', 180, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(12, 2, 'Risk Management Score', 'Compliance', 82.7, 'percentage', '{"P25": 72.0, "P50": 82.7, "P75": 88.0, "P90": 94.0}', 'Risk Assessment Benchmark', 165, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),

-- Healthcare (ID: 3) Benchmarks
(13, 3, 'Cloud Adoption Rate', 'Performance', 52.8, 'percentage', '{"P25": 35.0, "P50": 52.8, "P75": 65.0, "P90": 78.0}', 'Healthcare IT Survey', 420, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(14, 3, 'HIPAA Compliance Score', 'Compliance', 91.2, 'percentage', '{"P25": 85.0, "P50": 91.2, "P75": 95.0, "P90": 98.0}', 'Healthcare Compliance Study', 340, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(15, 3, 'System Interoperability Score', 'Performance', 73.5, 'percentage', '{"P25": 62.0, "P50": 73.5, "P75": 82.0, "P90": 89.0}', 'Healthcare Integration Report', 280, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(16, 3, 'Patient Data Security Incidents', 'Security', 2.1, 'incidents_per_year', '{"P25": 0.5, "P50": 2.1, "P75": 3.5, "P90": 6.0}', 'Healthcare Security Report', 450, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(17, 3, 'Electronic Health Record Adoption', 'Performance', 84.3, 'percentage', '{"P25": 76.0, "P50": 84.3, "P75": 90.0, "P90": 95.0}', 'EHR Adoption Survey', 680, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(18, 3, 'IT Budget as % of Revenue', 'Cost', 6.2, 'percentage', '{"P25": 4.5, "P50": 6.2, "P75": 8.0, "P90": 10.5}', 'Healthcare IT Spending Report', 190, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),

-- Manufacturing (ID: 4) Benchmarks
(19, 4, 'Cloud Adoption Rate', 'Performance', 48.7, 'percentage', '{"P25": 32.0, "P50": 48.7, "P75": 62.0, "P90": 75.0}', 'Manufacturing IT Survey', 520, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(20, 4, 'Overall Equipment Effectiveness', 'Performance', 78.5, 'percentage', '{"P25": 65.0, "P50": 78.5, "P75": 85.0, "P90": 92.0}', 'Manufacturing Performance Study', 380, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(21, 4, 'Predictive Maintenance Adoption', 'Performance', 42.3, 'percentage', '{"P25": 28.0, "P50": 42.3, "P75": 56.0, "P90": 68.0}', 'Industry 4.0 Adoption Report', 290, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(22, 4, 'Supply Chain Digitization', 'Performance', 67.8, 'percentage', '{"P25": 52.0, "P50": 67.8, "P75": 78.0, "P90": 87.0}', 'Supply Chain Technology Survey', 410, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(23, 4, 'Cybersecurity for OT Systems', 'Security', 71.2, 'percentage', '{"P25": 58.0, "P50": 71.2, "P75": 82.0, "P90": 90.0}', 'Industrial Cybersecurity Report', 240, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(24, 4, 'Energy Efficiency Score', 'Performance', 74.6, 'percentage', '{"P25": 62.0, "P50": 74.6, "P75": 83.0, "P90": 91.0}', 'Sustainability in Manufacturing', 350, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),

-- Technology (ID: 5) Benchmarks
(25, 5, 'Cloud-Native Architecture Adoption', 'Performance', 86.2, 'percentage', '{"P25": 75.0, "P50": 86.2, "P75": 92.0, "P90": 97.0}', 'Tech Industry Survey', 650, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(26, 5, 'System Availability (SLA)', 'Performance', 99.9, 'percentage', '{"P25": 99.5, "P50": 99.9, "P75": 99.95, "P90": 99.99}', 'SaaS Performance Report', 420, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(27, 5, 'Development Velocity', 'Performance', 12.3, 'deployments_per_week', '{"P25": 8.0, "P50": 12.3, "P75": 18.0, "P90": 25.0}', 'DevOps Practices Survey', 580, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(28, 5, 'API Response Time', 'Performance', 185.0, 'milliseconds', '{"P25": 120.0, "P50": 185.0, "P75": 250.0, "P90": 350.0}', 'API Performance Study', 320, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(29, 5, 'Security Vulnerability Resolution Time', 'Security', 4.2, 'days', '{"P25": 2.0, "P50": 4.2, "P75": 7.0, "P90": 12.0}', 'Security Response Benchmark', 280, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(30, 5, 'Customer Satisfaction Score', 'Performance', 87.4, 'percentage', '{"P25": 78.0, "P50": 87.4, "P75": 92.0, "P90": 96.0}', 'Customer Experience Survey', 750, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),

-- Government (ID: 6) Benchmarks
(31, 6, 'Cloud Adoption Rate', 'Performance', 42.1, 'percentage', '{"P25": 28.0, "P50": 42.1, "P75": 55.0, "P90": 68.0}', 'Government IT Modernization Survey', 180, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(32, 6, 'Citizen Satisfaction Score', 'Performance', 73.8, 'percentage', '{"P25": 65.0, "P50": 73.8, "P75": 82.0, "P90": 88.0}', 'Digital Government Services Report', 220, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(33, 6, 'Security Compliance Score', 'Compliance', 89.6, 'percentage', '{"P25": 82.0, "P50": 89.6, "P75": 94.0, "P90": 98.0}', 'Government Cybersecurity Assessment', 150, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(34, 6, 'Digital Service Delivery Time', 'Performance', 12.5, 'days', '{"P25": 8.0, "P50": 12.5, "P75": 18.0, "P90": 25.0}', 'Government Service Efficiency Study', 190, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(35, 6, 'Accessibility Compliance Score', 'Compliance', 78.2, 'percentage', '{"P25": 68.0, "P50": 78.2, "P75": 86.0, "P90": 92.0}', 'Digital Accessibility Audit', 140, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(36, 6, 'Legacy System Modernization', 'Performance', 34.7, 'percentage', '{"P25": 22.0, "P50": 34.7, "P75": 45.0, "P90": 58.0}', 'Government Modernization Report', 160, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),

-- Education (ID: 7) Benchmarks
(37, 7, 'Cloud Adoption Rate', 'Performance', 61.4, 'percentage', '{"P25": 45.0, "P50": 61.4, "P75": 72.0, "P90": 83.0}', 'Education Technology Survey', 320, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(38, 7, 'Student Data Protection Score', 'Compliance', 85.7, 'percentage', '{"P25": 78.0, "P50": 85.7, "P75": 91.0, "P90": 96.0}', 'FERPA Compliance Study', 280, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(39, 7, 'Learning Management System Adoption', 'Performance', 92.3, 'percentage', '{"P25": 85.0, "P50": 92.3, "P75": 96.0, "P90": 99.0}', 'EdTech Adoption Report', 450, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(40, 7, 'System Availability During Peak Hours', 'Performance', 98.5, 'percentage', '{"P25": 96.0, "P50": 98.5, "P75": 99.2, "P90": 99.7}', 'Educational IT Performance', 190, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(41, 7, 'Digital Learning Resource Usage', 'Performance', 76.8, 'percentage', '{"P25": 62.0, "P50": 76.8, "P75": 85.0, "P90": 92.0}', 'Digital Education Usage Study', 380, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(42, 7, 'IT Support Response Time', 'Performance', 4.8, 'hours', '{"P25": 2.5, "P50": 4.8, "P75": 8.0, "P90": 12.0}', 'Education IT Support Benchmark', 240, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),

-- Energy & Utilities (ID: 8) Benchmarks
(43, 8, 'Cloud Adoption Rate', 'Performance', 38.9, 'percentage', '{"P25": 25.0, "P50": 38.9, "P75": 50.0, "P90": 62.0}', 'Utility IT Modernization Survey', 120, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(44, 8, 'Grid Reliability Score', 'Performance', 99.94, 'percentage', '{"P25": 99.85, "P50": 99.94, "P75": 99.97, "P90": 99.99}', 'Electric Reliability Report', 95, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(45, 8, 'Cybersecurity Maturity Score', 'Security', 82.3, 'percentage', '{"P25": 72.0, "P50": 82.3, "P75": 88.0, "P90": 94.0}', 'Critical Infrastructure Security', 85, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(46, 8, 'Smart Grid Technology Adoption', 'Performance', 56.7, 'percentage', '{"P25": 42.0, "P50": 56.7, "P75": 68.0, "P90": 78.0}', 'Smart Grid Deployment Study', 110, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(47, 8, 'Renewable Energy Integration', 'Performance', 28.4, 'percentage_of_generation', '{"P25": 18.0, "P50": 28.4, "P75": 38.0, "P90": 48.0}', 'Renewable Integration Report', 140, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE())),
(48, 8, 'Customer Service Digital Channel Usage', 'Performance', 64.2, 'percentage', '{"P25": 48.0, "P50": 64.2, "P75": 75.0, "P90": 84.0}', 'Utility Customer Experience Study', 160, GETUTCDATE(), DATEADD(year, 1, GETUTCDATE()));

-- Set identity insert off
SET IDENTITY_INSERT IndustryBenchmarks OFF;

PRINT 'IndustryBenchmarks seeding completed - 48 benchmarks added across 8 industries';