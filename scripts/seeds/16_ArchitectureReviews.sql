-- Seed data for ArchitectureReviews table
PRINT 'Seeding ArchitectureReviews table...'

INSERT INTO ArchitectureReviews (
    AssessmentId,
    MaintainabilityScore,
    ComplexityScore,
    CouplingScore,
    CohesionScore,
    TestCoverageScore,
    TechnicalDebtScore,
    CodeSmells,
    DuplicatedLines,
    Vulnerabilities,
    Bugs,
    SecurityHotspots,
    RepositoryUrl,
    RepositoryType,
    RepositoryStatus,
    LastCommitHash,
    LastCommitDate,
    ArchitectureAnalysis,
    HealthAnalysis,
    PatternsAnalysis,
    TechnologyAnalysis,
    MaintainabilityAnalysis,
    RecommendationsAnalysis,
    CreatedDate,
    LastUpdatedDate,
    LastUpdatedBy
) VALUES 
-- Architecture Review for Assessment 1 (E-commerce)
(1, 72, 68, 65, 78, 75, 35, 145, 12.5, 8, 23, 5, 'https://github.com/techcorp/ecommerce-platform', 'github', 'connected', 'a7f8d9e2', '2024-01-10', 'Monolithic .NET Framework application with tightly coupled components. Database-centric architecture with stored procedures handling business logic.', 'Overall health score: 68/100. Main concerns: high coupling, moderate technical debt, and limited test coverage in legacy modules.', 'Current patterns: Repository pattern (60%), MVC (100%), Singleton (overused). Missing: CQRS, Event Sourcing, Circuit Breaker patterns needed for cloud migration.', 'Technology stack shows mixed maturity. Frontend React (modern), but backend on legacy .NET Framework 4.8. Database SQL Server 2019 is current but needs cloud optimization.', 'Maintainability index of 72 is acceptable but declining. High cyclomatic complexity in payment and order processing modules. Recommend refactoring before migration.', 'Priority 1: Decompose monolith using Strangler Fig pattern. Priority 2: Implement API Gateway. Priority 3: Containerize services. Priority 4: Implement observability.', GETDATE(), GETDATE(), 'System'),

-- Architecture Review for Assessment 2 (Banking)
(2, 45, 92, 88, 42, 38, 78, 892, 35.2, 45, 156, 28, 'https://dev.azure.com/securebank/core-banking', 'azure-devops', 'connected', 'b3c4d5e6', '2024-01-25', 'Legacy COBOL mainframe with hierarchical database. Batch-oriented processing with overnight settlement cycles. Green screen terminals for user interaction.', 'Overall health score: 42/100. Critical issues: extremely high complexity, poor cohesion, minimal test coverage, substantial technical debt accumulated over 30+ years.', 'Patterns largely absent in legacy code. Procedural programming dominates. Need to introduce Domain-Driven Design, Event Sourcing for audit trail, CQRS for read/write separation.', 'Technology severely outdated: COBOL (1990s version), DB2 hierarchical database, 3270 terminal emulation. Urgent modernization required for competitive positioning.', 'Maintainability index of 45 indicates significant challenges. Knowledge transfer risk high as COBOL developers retire. Documentation sparse and outdated.', 'Phase 1: Database modernization to relational model. Phase 2: API layer for legacy integration. Phase 3: Gradual service extraction. Phase 4: New digital banking platform.', GETDATE(), GETDATE(), 'System'),

-- Architecture Review for Assessment 3 (Healthcare)
(3, 65, 74, 71, 68, 62, 48, 234, 18.7, 15, 67, 12, 'https://gitlab.medtech.com/clinical/patient-platform', 'gitlab', 'connected', 'c5d6e7f8', '2024-02-05', 'Distributed client-server architecture with multiple standalone applications. Point-to-point integrations using HL7 v2. Mix of on-premise and cloud services.', 'Overall health score: 65/100. Moderate health with improvements needed in integration architecture, data consistency, and security standardization across systems.', 'Current patterns: Client-Server (predominant), Service Locator, Factory pattern. Need: API Gateway, Saga pattern for distributed transactions, FHIR Facade for interoperability.', 'Mixed technology landscape: C# (.NET Core 3.1 and .NET 6), Java (Spring Boot), Python (data analytics). Databases include SQL Server, MongoDB, PostgreSQL.', 'Maintainability index of 65 is moderate. Integration complexity is the main challenge. Code duplication across similar clinical modules. Need unified component library.', 'Recommendation 1: Implement FHIR-compliant API layer. Recommendation 2: Centralize patient data with proper consent management. Recommendation 3: Standardize on cloud-native architecture.', GETDATE(), GETDATE(), 'System');

PRINT 'ArchitectureReviews seeded successfully!'
SELECT COUNT(*) as [ArchitectureReviews Count] FROM ArchitectureReviews;