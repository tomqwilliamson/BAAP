using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BAAP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNewApplicationAndIndustryModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BusinessCriticality",
                table: "Applications",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BusinessDomain",
                table: "Applications",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeploymentModel",
                table: "Applications",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModernizationPriority",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RepositoryUrl",
                table: "Applications",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Applications",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnologyStack",
                table: "Applications",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DocumentEmbeddings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExtractedText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmbeddingVector = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssessmentId = table.Column<int>(type: "int", nullable: false),
                    ModuleType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KeyFindings = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Metadata = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ChunkIndex = table.Column<int>(type: "int", nullable: false),
                    TotalChunks = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentEmbeddings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocumentEmbeddings_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IndustryClassifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IndustryCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IndustryName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParentIndustryId = table.Column<int>(type: "int", nullable: true),
                    ComplianceFrameworks = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TechnologyPatterns = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegulatoryConsiderations = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KeyPerformanceIndicators = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RiskFactors = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BestPractices = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CloudAdoptionPattern = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TypicalComplexityScore = table.Column<int>(type: "int", nullable: false),
                    SecurityRequirements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomPromptTemplate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndustryClassifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IndustryClassifications_IndustryClassifications_ParentIndustryId",
                        column: x => x.ParentIndustryId,
                        principalTable: "IndustryClassifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AssessmentIndustryClassifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssessmentId = table.Column<int>(type: "int", nullable: false),
                    IndustryClassificationId = table.Column<int>(type: "int", nullable: false),
                    ClassificationConfidence = table.Column<double>(type: "float", nullable: false),
                    ClassificationMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClassificationReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    ClassifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssessmentIndustryClassifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssessmentIndustryClassifications_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssessmentIndustryClassifications_IndustryClassifications_IndustryClassificationId",
                        column: x => x.IndustryClassificationId,
                        principalTable: "IndustryClassifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IndustryBenchmarks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IndustryClassificationId = table.Column<int>(type: "int", nullable: false),
                    MetricName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MetricCategory = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BenchmarkValue = table.Column<double>(type: "float", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PercentileData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataSource = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SampleSize = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValidUntil = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndustryBenchmarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IndustryBenchmarks_IndustryClassifications_IndustryClassificationId",
                        column: x => x.IndustryClassificationId,
                        principalTable: "IndustryClassifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentIndustryClassifications_AssessmentId",
                table: "AssessmentIndustryClassifications",
                column: "AssessmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentIndustryClassifications_IndustryClassificationId",
                table: "AssessmentIndustryClassifications",
                column: "IndustryClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentEmbeddings_AssessmentId",
                table: "DocumentEmbeddings",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_IndustryBenchmarks_IndustryClassificationId_MetricCategory",
                table: "IndustryBenchmarks",
                columns: new[] { "IndustryClassificationId", "MetricCategory" });

            migrationBuilder.CreateIndex(
                name: "IX_IndustryClassifications_IndustryCode",
                table: "IndustryClassifications",
                column: "IndustryCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IndustryClassifications_ParentIndustryId",
                table: "IndustryClassifications",
                column: "ParentIndustryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssessmentIndustryClassifications");

            migrationBuilder.DropTable(
                name: "DocumentEmbeddings");

            migrationBuilder.DropTable(
                name: "IndustryBenchmarks");

            migrationBuilder.DropTable(
                name: "IndustryClassifications");

            migrationBuilder.DropColumn(
                name: "BusinessCriticality",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "BusinessDomain",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "DeploymentModel",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ModernizationPriority",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "RepositoryUrl",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "TechnologyStack",
                table: "Applications");
        }
    }
}
