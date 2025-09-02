using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BAAP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAIAnalysisResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ArchitectureReviewLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BusinessContextLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CloudMigrationLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataArchitectureLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DevOpsLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InfrastructureLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RecommendationsLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SecurityLastAiAnalysis",
                table: "Assessments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AIAnalysisResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssessmentId = table.Column<int>(type: "int", nullable: false),
                    ModuleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ResultsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AnalysisMode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Version = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIAnalysisResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AIAnalysisResults_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AIAnalysisResults_AssessmentId_ModuleName",
                table: "AIAnalysisResults",
                columns: new[] { "AssessmentId", "ModuleName" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIAnalysisResults");

            migrationBuilder.DropColumn(
                name: "ArchitectureReviewLastAiAnalysis",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "BusinessContextLastAiAnalysis",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "CloudMigrationLastAiAnalysis",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "DataArchitectureLastAiAnalysis",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "DevOpsLastAiAnalysis",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "InfrastructureLastAiAnalysis",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "RecommendationsLastAiAnalysis",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "SecurityLastAiAnalysis",
                table: "Assessments");
        }
    }
}
