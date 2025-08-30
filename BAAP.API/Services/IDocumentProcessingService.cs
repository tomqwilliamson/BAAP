using BAAP.API.Services;
using BAAP.API.Models;

namespace BAAP.API.Services;

public interface IDocumentProcessingService
{
    Task<DocumentProcessingResult> ProcessDocumentAsync(Stream documentStream, string fileName, string contentType);
    Task<ProcessedDocument> ProcessAndStoreDocumentAsync(Stream documentStream, string fileName, string contentType);
    Task<string> ExtractTextFromPdfAsync(Stream pdfStream);
    Task<string> ExtractTextFromWordAsync(Stream wordStream);
    Task<string> ExtractTextFromExcelAsync(Stream excelStream);
    Task<string> ExtractTextFromPowerPointAsync(Stream pptStream);
    Task<List<string>> ExtractKeyFindingsAsync(string documentText, string documentType);
    Task<DocumentClassificationResult> AnalyzeDocumentContentAsync(string documentText);
    Task<string> GenerateDocumentInsightsAsync(string documentText, string documentType);
    Task<List<string>> ExtractTechnicalConceptsAsync(string documentText);
    bool IsSupportedFormat(string contentType);
}

public class DocumentProcessingService : IDocumentProcessingService
{
    private readonly ILogger<DocumentProcessingService> _logger;
    private readonly ISemanticKernelService _semanticKernel;
    private readonly IVectorStorageService _vectorStorage;

    public DocumentProcessingService(
        ILogger<DocumentProcessingService> logger, 
        ISemanticKernelService semanticKernel,
        IVectorStorageService vectorStorage)
    {
        _logger = logger;
        _semanticKernel = semanticKernel;
        _vectorStorage = vectorStorage;
    }

    public async Task<DocumentProcessingResult> ProcessDocumentAsync(Stream documentStream, string fileName, string contentType)
    {
        try
        {
            if (!IsSupportedFormat(contentType))
            {
                return new DocumentProcessingResult
                {
                    Success = false,
                    ProcessingError = $"Unsupported file format: {contentType}"
                };
            }

            var extractedText = await ExtractTextBasedOnType(documentStream, contentType);
            
            if (string.IsNullOrEmpty(extractedText))
            {
                return new DocumentProcessingResult
                {
                    Success = false,
                    ProcessingError = "Could not extract text from document"
                };
            }

            var documentType = DetermineDocumentType(fileName, extractedText);
            var keyFindings = await ExtractKeyFindingsAsync(extractedText, documentType);

            return new DocumentProcessingResult
            {
                Success = true,
                ExtractedText = extractedText,
                KeyFindings = keyFindings,
                DocumentType = documentType
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing document {FileName}", fileName);
            return new DocumentProcessingResult
            {
                Success = false,
                ProcessingError = ex.Message
            };
        }
    }

    public async Task<ProcessedDocument> ProcessAndStoreDocumentAsync(Stream documentStream, string fileName, string contentType)
    {
        try
        {
            // Process the document first
            var processingResult = await ProcessDocumentAsync(documentStream, fileName, contentType);
            
            if (!processingResult.Success)
            {
                throw new InvalidOperationException(processingResult.ProcessingError);
            }

            // Create ProcessedDocument with enhanced analysis
            var processedDocument = new ProcessedDocument
            {
                Id = Guid.NewGuid().ToString(),
                FileName = fileName,
                ContentType = contentType,
                ExtractedText = processingResult.ExtractedText,
                KeyFindings = processingResult.KeyFindings,
                DocumentType = processingResult.DocumentType,
                UploadedAt = DateTime.UtcNow,
                SizeBytes = documentStream.Length
            };

            // Generate AI-powered summary and insights
            processedDocument.Summary = await _semanticKernel.GenerateDocumentSummaryAsync(processingResult.ExtractedText);
            
            // Classify document using AI
            var classificationResult = await AnalyzeDocumentContentAsync(processingResult.ExtractedText);
            processedDocument.DocumentType = classificationResult.PrimaryCategory;
            
            // Extract technical concepts
            var technicalConcepts = await ExtractTechnicalConceptsAsync(processingResult.ExtractedText);
            processedDocument.Metadata["TechnicalConcepts"] = technicalConcepts;
            processedDocument.Metadata["ClassificationConfidence"] = classificationResult.Confidence;
            processedDocument.Metadata["KeyIndicators"] = classificationResult.KeyIndicators;

            // Generate document insights
            var insights = await GenerateDocumentInsightsAsync(processingResult.ExtractedText, processedDocument.DocumentType);
            processedDocument.Metadata["AIInsights"] = insights;

            // Store in vector storage
            await _vectorStorage.StoreDocumentAsync(processedDocument);

            _logger.LogInformation("Successfully processed and stored document {DocumentId} ({FileName})", 
                processedDocument.Id, fileName);

            return processedDocument;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing and storing document {FileName}", fileName);
            throw;
        }
    }

    public async Task<string> ExtractTextFromPdfAsync(Stream pdfStream)
    {
        // TODO: Implement PDF text extraction using libraries like iTextSharp or PdfPig
        // For now, return simulated extraction
        _logger.LogInformation("PDF text extraction - using simulation mode");
        
        return await Task.FromResult(@"
SAMPLE PDF DOCUMENT CONTENT

Executive Summary
This document outlines the current state architecture and provides recommendations for cloud migration.

Key Findings:
- Current infrastructure consists of 45 physical servers
- Application portfolio includes 23 business applications
- Database systems require modernization for cloud compatibility
- Network architecture needs updates for hybrid connectivity

Recommendations:
- Implement phased migration approach starting with non-critical applications
- Modernize database systems using Azure PaaS services
- Establish hybrid network connectivity using Azure ExpressRoute
- Implement comprehensive monitoring and governance framework

Next Steps:
- Detailed application assessment and dependency mapping
- Proof of concept implementation for selected applications
- Staff training and skill development program
- Governance framework implementation
        ");
    }

    public async Task<string> ExtractTextFromWordAsync(Stream wordStream)
    {
        // TODO: Implement Word document text extraction using Open XML SDK or similar
        _logger.LogInformation("Word document text extraction - using simulation mode");
        
        return await Task.FromResult(@"
BUSINESS REQUIREMENTS DOCUMENT

Project Overview
The organization is undertaking a digital transformation initiative to modernize legacy systems and migrate to cloud infrastructure.

Business Drivers:
- Reduce operational costs by 30-40%
- Improve system availability and performance
- Enable scalability for future growth
- Enhance security and compliance posture
- Support remote workforce capabilities

Success Criteria:
- Zero business disruption during migration
- Achieve target cost savings within 12 months
- Improve system performance by 25%
- Maintain or improve security posture
- Complete migration within 18-month timeline

Stakeholder Requirements:
- IT Operations: Simplified management and monitoring
- Development Teams: Modern development platforms and tools
- Business Users: Improved application performance and availability
- Compliance Team: Enhanced audit capabilities and compliance reporting
        ");
    }

    public async Task<string> ExtractTextFromExcelAsync(Stream excelStream)
    {
        // TODO: Implement Excel text extraction using EPPlus or similar
        _logger.LogInformation("Excel text extraction - using simulation mode");
        
        return await Task.FromResult(@"
APPLICATION INVENTORY SPREADSHEET

Application Name | Technology Stack | Business Criticality | Migration Complexity | Dependencies
CustomerPortal | .NET Framework 4.8, SQL Server 2016 | High | Medium | ActiveDirectory, PaymentGateway
InventorySystem | Java 8, Oracle 11g | High | High | ERP, WMS, CustomerPortal
ReportingEngine | Python, PostgreSQL | Medium | Low | CustomerPortal, InventorySystem
InternalTools | PHP, MySQL | Low | Low | ActiveDirectory
BackupSystem | PowerShell, File Storage | Medium | Medium | All Applications

Infrastructure Summary:
- Total Applications: 23
- High Business Impact: 8 applications
- Medium Business Impact: 10 applications  
- Low Business Impact: 5 applications
- Migration Complexity: 6 High, 12 Medium, 5 Low
        ");
    }

    public async Task<string> ExtractTextFromPowerPointAsync(Stream pptStream)
    {
        // TODO: Implement PowerPoint text extraction using Open XML SDK
        _logger.LogInformation("PowerPoint text extraction - using simulation mode");
        
        return await Task.FromResult(@"
CLOUD MIGRATION STRATEGY PRESENTATION

Slide 1: Executive Summary
- Strategic initiative to modernize IT infrastructure
- Estimated 3-year program with $2.5M investment
- Expected ROI of 180% over 5 years
- Support for digital transformation objectives

Slide 2: Current State Assessment
- Legacy infrastructure nearing end-of-life
- Limited scalability and high maintenance costs
- Security concerns with aging systems
- Performance bottlenecks impacting business operations

Slide 3: Target State Vision
- Cloud-first architecture with hybrid capabilities
- Modern application platforms and DevOps practices
- Enhanced security and compliance framework
- Scalable and cost-effective infrastructure

Slide 4: Migration Approach
- Wave-based migration strategy
- Pilot applications for proof of concept
- Risk mitigation through comprehensive testing
- Change management and training programs

Slide 5: Success Metrics
- 99.9% uptime for critical applications
- 40% reduction in infrastructure costs
- 50% faster application deployment cycles
- Zero security incidents during migration
        ");
    }

    public async Task<List<string>> ExtractKeyFindingsAsync(string documentText, string documentType)
    {
        var systemPrompt = @"You are an expert document analyst specializing in enterprise architecture and cloud migration assessments.
            Extract the most important key findings from the document that would be relevant for cloud migration planning.
            Return 3-5 concise bullet points highlighting the critical insights.";

        var userPrompt = $@"Extract key findings from this {documentType} document for cloud migration assessment:

{documentText.Substring(0, Math.Min(documentText.Length, 2000))}

Return only the key findings as bullet points, focused on:
- Critical technical insights
- Business requirements or constraints  
- Risk factors or concerns
- Strategic recommendations
- Important metrics or data points";

        var findings = await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
        
        // Parse the response into individual findings
        var findingsList = findings
            .Split('\n')
            .Where(line => line.Trim().StartsWith("•") || line.Trim().StartsWith("-") || line.Trim().StartsWith("*"))
            .Select(line => line.Trim().TrimStart('•', '-', '*').Trim())
            .Where(line => !string.IsNullOrEmpty(line))
            .Take(5)
            .ToList();

        // If AI parsing failed, return default findings based on document content
        if (!findingsList.Any())
        {
            findingsList = GenerateDefaultFindings(documentText, documentType);
        }

        return findingsList;
    }

    public async Task<DocumentClassificationResult> AnalyzeDocumentContentAsync(string documentText)
    {
        return await _vectorStorage.ClassifyDocumentAsync(documentText);
    }

    public async Task<string> GenerateDocumentInsightsAsync(string documentText, string documentType)
    {
        var systemPrompt = @"You are an expert enterprise consultant specializing in cloud migration and digital transformation.
            Generate strategic insights and actionable recommendations based on the document content.
            Focus on business impact, technical considerations, and implementation guidance.";

        var userPrompt = $@"Generate strategic insights for this {documentType} document:

{documentText.Substring(0, Math.Min(documentText.Length, 3000))}

Provide insights covering:
- Strategic implications for cloud migration
- Risk assessment and mitigation strategies  
- Technical recommendations and best practices
- Business impact and value proposition
- Implementation roadmap suggestions

Format as structured analysis with clear sections.";

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<List<string>> ExtractTechnicalConceptsAsync(string documentText)
    {
        var systemPrompt = @"You are a technical analyst expert in cloud technologies, enterprise architecture, and software development.
            Extract and identify key technical concepts, technologies, frameworks, and methodologies mentioned in the document.
            Focus on technologies relevant to cloud migration, modernization, and enterprise architecture.";

        var userPrompt = $@"Extract technical concepts from this document:

{documentText.Substring(0, Math.Min(documentText.Length, 2000))}

Identify:
- Programming languages and frameworks
- Database technologies
- Cloud platforms and services
- Architecture patterns and methodologies
- DevOps and deployment tools
- Security technologies
- Integration technologies

Return only the technical terms as a bullet-point list.";

        var response = await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
        
        // Parse the response into individual concepts
        var concepts = response
            .Split('\n')
            .Where(line => line.Trim().StartsWith("•") || line.Trim().StartsWith("-") || line.Trim().StartsWith("*"))
            .Select(line => line.Trim().TrimStart('•', '-', '*').Trim())
            .Where(line => !string.IsNullOrEmpty(line))
            .Take(15)
            .ToList();

        // If AI parsing failed, return default concepts based on document content
        if (!concepts.Any())
        {
            concepts = ExtractDefaultTechnicalConcepts(documentText);
        }

        return concepts;
    }

    public bool IsSupportedFormat(string contentType)
    {
        var supportedTypes = new[]
        {
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
            "application/vnd.ms-powerpoint", // .ppt
            "text/plain",
            "text/csv"
        };

        return supportedTypes.Contains(contentType.ToLower());
    }

    private async Task<string> ExtractTextBasedOnType(Stream documentStream, string contentType)
    {
        return contentType.ToLower() switch
        {
            "application/pdf" => await ExtractTextFromPdfAsync(documentStream),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => await ExtractTextFromWordAsync(documentStream),
            "application/msword" => await ExtractTextFromWordAsync(documentStream),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => await ExtractTextFromExcelAsync(documentStream),
            "application/vnd.ms-excel" => await ExtractTextFromExcelAsync(documentStream),
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" => await ExtractTextFromPowerPointAsync(documentStream),
            "application/vnd.ms-powerpoint" => await ExtractTextFromPowerPointAsync(documentStream),
            "text/plain" => await ExtractTextFromPlainTextAsync(documentStream),
            "text/csv" => await ExtractTextFromPlainTextAsync(documentStream),
            _ => string.Empty
        };
    }

    private async Task<string> ExtractTextFromPlainTextAsync(Stream textStream)
    {
        using var reader = new StreamReader(textStream);
        return await reader.ReadToEndAsync();
    }

    private string DetermineDocumentType(string fileName, string content)
    {
        var lowerFileName = fileName.ToLower();
        var lowerContent = content.ToLower();

        if (lowerFileName.Contains("architecture") || lowerContent.Contains("architecture"))
            return "Architecture Document";
        if (lowerFileName.Contains("business") || lowerContent.Contains("business requirements"))
            return "Business Requirements";
        if (lowerFileName.Contains("security") || lowerContent.Contains("security"))
            return "Security Documentation";
        if (lowerFileName.Contains("infrastructure") || lowerContent.Contains("infrastructure"))
            return "Infrastructure Documentation";
        if (lowerFileName.Contains("application") || lowerContent.Contains("application inventory"))
            return "Application Documentation";
        if (lowerFileName.Contains("network") || lowerContent.Contains("network"))
            return "Network Documentation";
        if (lowerFileName.Contains("data") || lowerContent.Contains("database"))
            return "Data Architecture";
        
        return "Technical Documentation";
    }

    private List<string> GenerateDefaultFindings(string documentText, string documentType)
    {
        var defaultFindings = new List<string>();
        var lowerContent = documentText.ToLower();

        // Generate findings based on common patterns in the content
        if (lowerContent.Contains("server") || lowerContent.Contains("infrastructure"))
        {
            defaultFindings.Add("Infrastructure assessment identifies server inventory and capacity requirements");
        }
        
        if (lowerContent.Contains("application") || lowerContent.Contains("system"))
        {
            defaultFindings.Add("Application portfolio analysis reveals modernization opportunities");
        }
        
        if (lowerContent.Contains("cost") || lowerContent.Contains("saving"))
        {
            defaultFindings.Add("Cost optimization potential identified through cloud migration");
        }
        
        if (lowerContent.Contains("security") || lowerContent.Contains("compliance"))
        {
            defaultFindings.Add("Security and compliance requirements need consideration in migration planning");
        }
        
        if (lowerContent.Contains("performance") || lowerContent.Contains("availability"))
        {
            defaultFindings.Add("Performance and availability improvements expected from cloud adoption");
        }

        // Ensure we have at least one finding
        if (!defaultFindings.Any())
        {
            defaultFindings.Add($"{documentType} contains relevant information for cloud migration assessment");
        }

        return defaultFindings.Take(5).ToList();
    }

    private List<string> ExtractDefaultTechnicalConcepts(string documentText)
    {
        var concepts = new List<string>();
        var lowerContent = documentText.ToLower();

        var technicalTerms = new Dictionary<string, string[]>
        {
            ["Cloud Platforms"] = new[] { "azure", "aws", "google cloud", "gcp" },
            ["Databases"] = new[] { "sql server", "oracle", "mysql", "postgresql", "mongodb" },
            ["Programming"] = new[] { ".net", "java", "python", "javascript", "c#", "node.js" },
            ["Architecture"] = new[] { "microservices", "rest api", "soap", "mvc", "soa" },
            ["DevOps"] = new[] { "docker", "kubernetes", "jenkins", "terraform", "ansible" },
            ["Security"] = new[] { "active directory", "oauth", "ssl", "encryption", "firewall" }
        };

        foreach (var category in technicalTerms)
        {
            foreach (var term in category.Value)
            {
                if (lowerContent.Contains(term))
                {
                    concepts.Add(term);
                }
            }
        }

        return concepts.Take(10).ToList();
    }
}