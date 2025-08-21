using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BAAP.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Assessments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StartedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EstimatedCost = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    PotentialSavings = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    OverallScore = table.Column<int>(type: "INTEGER", nullable: false),
                    SecurityScore = table.Column<int>(type: "INTEGER", nullable: false),
                    CloudReadinessScore = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assessments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Type = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Technology = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LinesOfCode = table.Column<int>(type: "INTEGER", nullable: false),
                    ComplexityScore = table.Column<int>(type: "INTEGER", nullable: false),
                    SecurityRating = table.Column<int>(type: "INTEGER", nullable: false),
                    CloudReadinessScore = table.Column<int>(type: "INTEGER", nullable: false),
                    EstimatedMigrationCost = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    MonthlyCost = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastAnalyzedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    AssessmentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Applications_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessDrivers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Priority = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Impact = table.Column<int>(type: "INTEGER", nullable: false),
                    Urgency = table.Column<int>(type: "INTEGER", nullable: false),
                    BusinessValue = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AssessmentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessDrivers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinessDrivers_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DashboardMetrics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MetricName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Value = table.Column<double>(type: "REAL", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    RecordedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AssessmentId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardMetrics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DashboardMetrics_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Recommendations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Priority = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Effort = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    EstimatedCost = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    PotentialSavings = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    TimeframeWeeks = table.Column<int>(type: "INTEGER", nullable: true),
                    Implementation = table.Column<string>(type: "TEXT", nullable: true),
                    Benefits = table.Column<string>(type: "TEXT", nullable: true),
                    Risks = table.Column<string>(type: "TEXT", nullable: true),
                    IsAccepted = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AssessmentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recommendations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recommendations_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stakeholders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Department = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    InfluenceLevel = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    InterestLevel = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AssessmentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stakeholders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stakeholders_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CodeMetrics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MetricName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Value = table.Column<double>(type: "REAL", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    MeasuredDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ApplicationId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CodeMetrics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CodeMetrics_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SecurityFindings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Severity = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    LineNumber = table.Column<int>(type: "INTEGER", nullable: true),
                    Source = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    IsResolved = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ResolvedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ApplicationId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecurityFindings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SecurityFindings_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_AssessmentId",
                table: "Applications",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessDrivers_AssessmentId",
                table: "BusinessDrivers",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_CodeMetrics_ApplicationId",
                table: "CodeMetrics",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_DashboardMetrics_AssessmentId",
                table: "DashboardMetrics",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Recommendations_AssessmentId",
                table: "Recommendations",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_SecurityFindings_ApplicationId",
                table: "SecurityFindings",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Stakeholders_AssessmentId",
                table: "Stakeholders",
                column: "AssessmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusinessDrivers");

            migrationBuilder.DropTable(
                name: "CodeMetrics");

            migrationBuilder.DropTable(
                name: "DashboardMetrics");

            migrationBuilder.DropTable(
                name: "Recommendations");

            migrationBuilder.DropTable(
                name: "SecurityFindings");

            migrationBuilder.DropTable(
                name: "Stakeholders");

            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "Assessments");
        }
    }
}
