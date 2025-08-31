using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BAAP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboardMetricFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApplicationCount",
                table: "Assessments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CodeQualityScore",
                table: "Assessments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DatabaseOptimizationScore",
                table: "Assessments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DevOpsMaturityScore",
                table: "Assessments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DocumentationScore",
                table: "Assessments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "InfrastructureScore",
                table: "Assessments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CriticalFindings",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CriticalIssues",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HighFindings",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SecurityIssues",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationCount",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "CodeQualityScore",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "DatabaseOptimizationScore",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "DevOpsMaturityScore",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "DocumentationScore",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "InfrastructureScore",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "CriticalFindings",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "CriticalIssues",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "HighFindings",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "SecurityIssues",
                table: "Applications");
        }
    }
}
