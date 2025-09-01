using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BAAP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddArchitectureReviewModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ArchitectureReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssessmentId = table.Column<int>(type: "int", nullable: false),
                    MaintainabilityScore = table.Column<int>(type: "int", nullable: false),
                    ComplexityScore = table.Column<int>(type: "int", nullable: false),
                    CouplingScore = table.Column<int>(type: "int", nullable: false),
                    CohesionScore = table.Column<int>(type: "int", nullable: false),
                    TestCoverageScore = table.Column<int>(type: "int", nullable: false),
                    TechnicalDebtScore = table.Column<int>(type: "int", nullable: false),
                    CodeSmells = table.Column<int>(type: "int", nullable: false),
                    DuplicatedLines = table.Column<double>(type: "float", nullable: false),
                    Vulnerabilities = table.Column<int>(type: "int", nullable: false),
                    Bugs = table.Column<int>(type: "int", nullable: false),
                    SecurityHotspots = table.Column<int>(type: "int", nullable: false),
                    RepositoryUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RepositoryType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RepositoryStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastCommitHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastCommitDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ArchitectureAnalysis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HealthAnalysis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PatternsAnalysis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TechnologyAnalysis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaintainabilityAnalysis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RecommendationsAnalysis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArchitectureReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArchitectureReviews_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArchitecturePatterns",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArchitectureReviewId = table.Column<int>(type: "int", nullable: false),
                    PatternName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Usage = table.Column<int>(type: "int", nullable: false),
                    Quality = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Recommendation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Maturity = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArchitecturePatterns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArchitecturePatterns_ArchitectureReviews_ArchitectureReviewId",
                        column: x => x.ArchitectureReviewId,
                        principalTable: "ArchitectureReviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CodebaseStats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArchitectureReviewId = table.Column<int>(type: "int", nullable: false),
                    Language = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LinesOfCode = table.Column<int>(type: "int", nullable: false),
                    Percentage = table.Column<double>(type: "float", nullable: false),
                    FileCount = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CodebaseStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CodebaseStats_ArchitectureReviews_ArchitectureReviewId",
                        column: x => x.ArchitectureReviewId,
                        principalTable: "ArchitectureReviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyStacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArchitectureReviewId = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Technology = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Version = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Risk = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Recommendation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyStacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyStacks_ArchitectureReviews_ArchitectureReviewId",
                        column: x => x.ArchitectureReviewId,
                        principalTable: "ArchitectureReviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArchitecturePatterns_ArchitectureReviewId",
                table: "ArchitecturePatterns",
                column: "ArchitectureReviewId");

            migrationBuilder.CreateIndex(
                name: "IX_ArchitectureReviews_AssessmentId",
                table: "ArchitectureReviews",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_CodebaseStats_ArchitectureReviewId",
                table: "CodebaseStats",
                column: "ArchitectureReviewId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyStacks_ArchitectureReviewId",
                table: "TechnologyStacks",
                column: "ArchitectureReviewId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArchitecturePatterns");

            migrationBuilder.DropTable(
                name: "CodebaseStats");

            migrationBuilder.DropTable(
                name: "TechnologyStacks");

            migrationBuilder.DropTable(
                name: "ArchitectureReviews");
        }
    }
}
