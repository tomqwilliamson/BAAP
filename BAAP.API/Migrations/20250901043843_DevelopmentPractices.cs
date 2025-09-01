using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BAAP.API.Migrations
{
    /// <inheritdoc />
    public partial class DevelopmentPractices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DevelopmentPractices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssessmentId = table.Column<int>(type: "int", nullable: false),
                    PrimaryMethodology = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SprintLength = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ReleaseFrequency = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HasDedicatedQA = table.Column<bool>(type: "bit", nullable: false),
                    ManualTesting = table.Column<bool>(type: "bit", nullable: false),
                    AutomatedTesting = table.Column<bool>(type: "bit", nullable: false),
                    UnitTesting = table.Column<bool>(type: "bit", nullable: false),
                    IntegrationTesting = table.Column<bool>(type: "bit", nullable: false),
                    E2ETesting = table.Column<bool>(type: "bit", nullable: false),
                    PerformanceTesting = table.Column<bool>(type: "bit", nullable: false),
                    CodeCoverageTarget = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TotalTeamSize = table.Column<int>(type: "int", nullable: false),
                    NumberOfScrumTeams = table.Column<int>(type: "int", nullable: false),
                    SoftwareDevelopers = table.Column<int>(type: "int", nullable: false),
                    SeniorLeadDevelopers = table.Column<int>(type: "int", nullable: false),
                    QAEngineers = table.Column<int>(type: "int", nullable: false),
                    DatabaseEngineers = table.Column<int>(type: "int", nullable: false),
                    DevOpsEngineers = table.Column<int>(type: "int", nullable: false),
                    BusinessAnalysts = table.Column<int>(type: "int", nullable: false),
                    ProductManagers = table.Column<int>(type: "int", nullable: false),
                    ProjectManagers = table.Column<int>(type: "int", nullable: false),
                    ScrumMasters = table.Column<int>(type: "int", nullable: false),
                    UIUXDesigners = table.Column<int>(type: "int", nullable: false),
                    Architects = table.Column<int>(type: "int", nullable: false),
                    CodeReviews = table.Column<bool>(type: "bit", nullable: false),
                    PairProgramming = table.Column<bool>(type: "bit", nullable: false),
                    TestDrivenDevelopment = table.Column<bool>(type: "bit", nullable: false),
                    BehaviorDrivenDevelopment = table.Column<bool>(type: "bit", nullable: false),
                    ContinuousIntegration = table.Column<bool>(type: "bit", nullable: false),
                    ContinuousDeployment = table.Column<bool>(type: "bit", nullable: false),
                    FeatureFlags = table.Column<bool>(type: "bit", nullable: false),
                    ABTesting = table.Column<bool>(type: "bit", nullable: false),
                    CodeDocumentationStandards = table.Column<bool>(type: "bit", nullable: false),
                    APIDocumentation = table.Column<bool>(type: "bit", nullable: false),
                    TechnicalDebtManagement = table.Column<bool>(type: "bit", nullable: false),
                    PerformanceMonitoring = table.Column<bool>(type: "bit", nullable: false),
                    MicrosoftTeams = table.Column<bool>(type: "bit", nullable: false),
                    Slack = table.Column<bool>(type: "bit", nullable: false),
                    Discord = table.Column<bool>(type: "bit", nullable: false),
                    Email = table.Column<bool>(type: "bit", nullable: false),
                    OtherCommunicationTools = table.Column<bool>(type: "bit", nullable: false),
                    AzureDevOps = table.Column<bool>(type: "bit", nullable: false),
                    Jira = table.Column<bool>(type: "bit", nullable: false),
                    GitHubProjects = table.Column<bool>(type: "bit", nullable: false),
                    Trello = table.Column<bool>(type: "bit", nullable: false),
                    Asana = table.Column<bool>(type: "bit", nullable: false),
                    MondayCom = table.Column<bool>(type: "bit", nullable: false),
                    OtherProjectManagementTools = table.Column<bool>(type: "bit", nullable: false),
                    DailyStandups = table.Column<bool>(type: "bit", nullable: false),
                    SprintPlanning = table.Column<bool>(type: "bit", nullable: false),
                    SprintReviews = table.Column<bool>(type: "bit", nullable: false),
                    Retrospectives = table.Column<bool>(type: "bit", nullable: false),
                    BacklogGrooming = table.Column<bool>(type: "bit", nullable: false),
                    ArchitectureReviews = table.Column<bool>(type: "bit", nullable: false),
                    PrimaryProgrammingLanguages = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    VisualStudio = table.Column<bool>(type: "bit", nullable: false),
                    VSCode = table.Column<bool>(type: "bit", nullable: false),
                    IntelliJIDEA = table.Column<bool>(type: "bit", nullable: false),
                    Eclipse = table.Column<bool>(type: "bit", nullable: false),
                    OtherIDEs = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevelopmentPractices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DevelopmentPractices_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DevelopmentPractices_AssessmentId",
                table: "DevelopmentPractices",
                column: "AssessmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DevelopmentPractices");
        }
    }
}
