using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BAAP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRecommendationEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EstimatedROI",
                table: "Recommendations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Impact",
                table: "Recommendations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Investment",
                table: "Recommendations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecommendationType",
                table: "Recommendations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Timeline",
                table: "Recommendations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedROI",
                table: "Recommendations");

            migrationBuilder.DropColumn(
                name: "Impact",
                table: "Recommendations");

            migrationBuilder.DropColumn(
                name: "Investment",
                table: "Recommendations");

            migrationBuilder.DropColumn(
                name: "RecommendationType",
                table: "Recommendations");

            migrationBuilder.DropColumn(
                name: "Timeline",
                table: "Recommendations");
        }
    }
}
