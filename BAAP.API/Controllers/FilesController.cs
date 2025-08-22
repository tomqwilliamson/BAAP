using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FilesController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<FilesController> _logger;
    private readonly IWebHostEnvironment _environment;
    private const long MaxFileSize = 50 * 1024 * 1024; // 50MB
    private static readonly string[] AllowedExtensions = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv", ".json", ".xml", ".zip" };

    public FilesController(BaapDbContext context, ILogger<FilesController> logger, IWebHostEnvironment environment)
    {
        _context = context;
        _logger = logger;
        _environment = environment;
    }

    // POST: api/files/upload
    [HttpPost("upload")]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<ActionResult> UploadFile([FromForm] FileUploadRequest request)
    {
        try
        {
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            if (request.File.Length > MaxFileSize)
            {
                return BadRequest($"File size exceeds maximum allowed size of {MaxFileSize / 1024 / 1024}MB");
            }

            var fileExtension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(fileExtension))
            {
                return BadRequest($"File type not allowed. Allowed types: {string.Join(", ", AllowedExtensions)}");
            }

            // Validate assessment exists if provided
            if (request.AssessmentId.HasValue)
            {
                var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == request.AssessmentId.Value);
                if (!assessmentExists)
                {
                    return BadRequest("Assessment not found");
                }
            }

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var uploadPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads");
            
            // Create uploads directory if it doesn't exist
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var filePath = Path.Combine(uploadPath, fileName);

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            // Save file metadata to database
            var fileRecord = new AssessmentFile
            {
                OriginalFileName = request.File.FileName,
                StoredFileName = fileName,
                FilePath = filePath,
                FileSize = request.File.Length,
                ContentType = request.File.ContentType,
                Category = request.Category ?? "General",
                Description = request.Description ?? "",
                AssessmentId = request.AssessmentId,
                UploadedDate = DateTime.UtcNow,
                UploadedBy = GetCurrentUserId()
            };

            _context.AssessmentFiles.Add(fileRecord);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = fileRecord.Id,
                fileName = fileRecord.OriginalFileName,
                size = fileRecord.FileSize,
                category = fileRecord.Category,
                uploadedDate = fileRecord.UploadedDate,
                message = "File uploaded successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file");
            return StatusCode(500, "An error occurred while uploading the file");
        }
    }

    // GET: api/files/assessment/{assessmentId}
    [HttpGet("assessment/{assessmentId}")]
    public async Task<ActionResult> GetAssessmentFiles(int assessmentId, [FromQuery] string? category = null)
    {
        try
        {
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
            if (!assessmentExists)
            {
                return NotFound("Assessment not found");
            }

            var query = _context.AssessmentFiles
                .Where(f => f.AssessmentId == assessmentId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(f => f.Category == category);
            }

            var files = await query
                .OrderByDescending(f => f.UploadedDate)
                .Select(f => new
                {
                    id = f.Id,
                    originalFileName = f.OriginalFileName,
                    fileSize = f.FileSize,
                    contentType = f.ContentType,
                    category = f.Category,
                    description = f.Description,
                    uploadedDate = f.UploadedDate,
                    uploadedBy = f.UploadedBy
                })
                .ToListAsync();

            var summary = new
            {
                totalFiles = files.Count,
                totalSize = files.Sum(f => f.fileSize),
                categories = files.GroupBy(f => f.category).ToDictionary(g => g.Key, g => g.Count())
            };

            return Ok(new
            {
                summary,
                files
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving files for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving files");
        }
    }

    // GET: api/files/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult> GetFileInfo(int id)
    {
        try
        {
            var file = await _context.AssessmentFiles
                .Include(f => f.Assessment)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (file == null)
            {
                return NotFound("File not found");
            }

            var result = new
            {
                id = file.Id,
                originalFileName = file.OriginalFileName,
                fileSize = file.FileSize,
                contentType = file.ContentType,
                category = file.Category,
                description = file.Description,
                uploadedDate = file.UploadedDate,
                uploadedBy = file.UploadedBy,
                assessment = file.Assessment != null ? new
                {
                    id = file.Assessment.Id,
                    name = file.Assessment.Name
                } : null
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving file info for ID {FileId}", id);
            return StatusCode(500, "An error occurred while retrieving file information");
        }
    }

    // GET: api/files/{id}/download
    [HttpGet("{id}/download")]
    public async Task<ActionResult> DownloadFile(int id)
    {
        try
        {
            var file = await _context.AssessmentFiles.FindAsync(id);
            if (file == null)
            {
                return NotFound("File not found");
            }

            if (!System.IO.File.Exists(file.FilePath))
            {
                return NotFound("Physical file not found");
            }

            var fileStream = new FileStream(file.FilePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, file.ContentType, file.OriginalFileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file with ID {FileId}", id);
            return StatusCode(500, "An error occurred while downloading the file");
        }
    }

    // PUT: api/files/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateFileInfo(int id, [FromBody] UpdateFileRequest request)
    {
        try
        {
            var file = await _context.AssessmentFiles.FindAsync(id);
            if (file == null)
            {
                return NotFound("File not found");
            }

            if (!string.IsNullOrEmpty(request.Category))
                file.Category = request.Category;
            
            if (request.Description != null)
                file.Description = request.Description;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = file.Id,
                originalFileName = file.OriginalFileName,
                category = file.Category,
                description = file.Description,
                message = "File information updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating file info for ID {FileId}", id);
            return StatusCode(500, "An error occurred while updating file information");
        }
    }

    // DELETE: api/files/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFile(int id)
    {
        try
        {
            var file = await _context.AssessmentFiles.FindAsync(id);
            if (file == null)
            {
                return NotFound("File not found");
            }

            // Delete physical file
            if (System.IO.File.Exists(file.FilePath))
            {
                System.IO.File.Delete(file.FilePath);
            }

            // Delete database record
            _context.AssessmentFiles.Remove(file);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = file.Id,
                fileName = file.OriginalFileName,
                message = "File deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file with ID {FileId}", id);
            return StatusCode(500, "An error occurred while deleting the file");
        }
    }

    // GET: api/files/categories
    [HttpGet("categories")]
    public ActionResult GetFileCategories()
    {
        try
        {
            var categories = new[]
            {
                new { value = "General", label = "General Documents" },
                new { value = "Requirements", label = "Requirements & Specifications" },
                new { value = "Architecture", label = "Architecture Diagrams" },
                new { value = "Security", label = "Security Documents" },
                new { value = "Code", label = "Code & Source Files" },
                new { value = "Database", label = "Database Scripts & Schemas" },
                new { value = "Infrastructure", label = "Infrastructure Documentation" },
                new { value = "Testing", label = "Test Plans & Results" },
                new { value = "Reports", label = "Reports & Analysis" },
                new { value = "Contracts", label = "Contracts & Agreements" },
                new { value = "Other", label = "Other" }
            };

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving file categories");
            return StatusCode(500, "An error occurred while retrieving file categories");
        }
    }

    // POST: api/files/bulk-upload
    [HttpPost("bulk-upload")]
    [RequestSizeLimit(MaxFileSize * 10)] // Allow larger total size for bulk uploads
    public async Task<ActionResult> BulkUploadFiles([FromForm] BulkFileUploadRequest request)
    {
        try
        {
            if (request.Files == null || !request.Files.Any())
            {
                return BadRequest("No files uploaded");
            }

            if (request.AssessmentId.HasValue)
            {
                var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == request.AssessmentId.Value);
                if (!assessmentExists)
                {
                    return BadRequest("Assessment not found");
                }
            }

            var uploadedFiles = new List<object>();
            var errors = new List<string>();
            var uploadPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            foreach (var file in request.Files)
            {
                try
                {
                    if (file.Length > MaxFileSize)
                    {
                        errors.Add($"{file.FileName}: File size exceeds maximum allowed size");
                        continue;
                    }

                    var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    if (!AllowedExtensions.Contains(fileExtension))
                    {
                        errors.Add($"{file.FileName}: File type not allowed");
                        continue;
                    }

                    var fileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var fileRecord = new AssessmentFile
                    {
                        OriginalFileName = file.FileName,
                        StoredFileName = fileName,
                        FilePath = filePath,
                        FileSize = file.Length,
                        ContentType = file.ContentType,
                        Category = request.Category ?? "General",
                        Description = request.Description ?? "",
                        AssessmentId = request.AssessmentId,
                        UploadedDate = DateTime.UtcNow,
                        UploadedBy = GetCurrentUserId()
                    };

                    _context.AssessmentFiles.Add(fileRecord);
                    await _context.SaveChangesAsync();

                    uploadedFiles.Add(new
                    {
                        id = fileRecord.Id,
                        fileName = fileRecord.OriginalFileName,
                        size = fileRecord.FileSize
                    });
                }
                catch (Exception ex)
                {
                    errors.Add($"{file.FileName}: {ex.Message}");
                }
            }

            return Ok(new
            {
                message = "Bulk upload completed",
                uploaded = uploadedFiles.Count,
                errors = errors.Count,
                uploadedFiles,
                errorDetails = errors
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk file upload");
            return StatusCode(500, "An error occurred during bulk file upload");
        }
    }

    private string GetCurrentUserId()
    {
        // Extract user ID from claims
        return User?.FindFirst("email")?.Value ?? "system";
    }
}

// Create the AssessmentFile model class
public class AssessmentFile
{
    public int Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? AssessmentId { get; set; }
    public DateTime UploadedDate { get; set; }
    public string UploadedBy { get; set; } = string.Empty;

    // Navigation property
    public Assessment? Assessment { get; set; }
}

public class FileUploadRequest
{
    public IFormFile File { get; set; } = null!;
    public string? Category { get; set; }
    public string? Description { get; set; }
    public int? AssessmentId { get; set; }
}

public class BulkFileUploadRequest
{
    public IFormFile[] Files { get; set; } = Array.Empty<IFormFile>();
    public string? Category { get; set; }
    public string? Description { get; set; }
    public int? AssessmentId { get; set; }
}

public class UpdateFileRequest
{
    public string? Category { get; set; }
    public string? Description { get; set; }
}