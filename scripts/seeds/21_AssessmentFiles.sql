-- Seed data for AssessmentFiles table
PRINT 'Seeding AssessmentFiles table...'

INSERT INTO AssessmentFiles (
    OriginalFileName,
    StoredFileName,
    FilePath,
    FileSize,
    ContentType,
    Category,
    [Description],
    AssessmentId,
    UploadedDate,
    UploadedBy
) VALUES 
-- Files for Assessment 1 (E-commerce)
('E-commerce_Architecture_Diagram.pdf', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf', '/uploads/assessment1/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf', 2048000, 'application/pdf', 'Architecture', 'Current system architecture diagram with all components and integrations', 1, GETDATE(), 'System Admin'),
('Performance_Test_Results.xlsx', 'b2c3d4e5-f6a7-8901-bcde-f23456789012.xlsx', '/uploads/assessment1/b2c3d4e5-f6a7-8901-bcde-f23456789012.xlsx', 1536000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Testing', 'Load testing and performance benchmarks for peak traffic scenarios', 1, GETDATE(), 'System Admin'),
('Security_Assessment_Report.docx', 'c3d4e5f6-a7b8-9012-cdef-345678901234.docx', '/uploads/assessment1/c3d4e5f6-a7b8-9012-cdef-345678901234.docx', 3072000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Security', 'Comprehensive security vulnerability assessment and remediation plan', 1, GETDATE(), 'System Admin'),

-- Files for Assessment 2 (Banking)
('Core_Banking_System_Documentation.pdf', 'd4e5f6a7-b8c9-0123-defa-456789012345.pdf', '/uploads/assessment2/d4e5f6a7-b8c9-0123-defa-456789012345.pdf', 8192000, 'application/pdf', 'Documentation', 'Complete technical documentation of core banking COBOL systems', 2, GETDATE(), 'System Admin'),
('Compliance_Audit_Report.docx', 'e5f6a7b8-c9d0-1234-efab-567890123456.docx', '/uploads/assessment2/e5f6a7b8-c9d0-1234-efab-567890123456.docx', 4096000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Compliance', 'SOX and Basel III compliance audit findings and recommendations', 2, GETDATE(), 'System Admin'),
('Legacy_System_Inventory.xlsx', 'f6a7b8c9-d0e1-2345-fabc-678901234567.xlsx', '/uploads/assessment2/f6a7b8c9-d0e1-2345-fabc-678901234567.xlsx', 2560000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Infrastructure', 'Complete inventory of legacy systems, dependencies, and modernization priorities', 2, GETDATE(), 'System Admin'),
('Risk_Assessment_Matrix.xlsx', 'a7b8c9d0-e1f2-3456-abcd-789012345678.xlsx', '/uploads/assessment2/a7b8c9d0-e1f2-3456-abcd-789012345678.xlsx', 1024000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Risk', 'Comprehensive risk assessment matrix with mitigation strategies', 2, GETDATE(), 'System Admin'),

-- Files for Assessment 3 (Healthcare)
('HIPAA_Compliance_Checklist.pdf', 'b8c9d0e1-f2a3-4567-bcde-890123456789.pdf', '/uploads/assessment3/b8c9d0e1-f2a3-4567-bcde-890123456789.pdf', 1792000, 'application/pdf', 'Compliance', 'HIPAA compliance checklist with current status and gaps analysis', 3, GETDATE(), 'System Admin'),
('EMR_Integration_Specification.docx', 'c9d0e1f2-a3b4-5678-cdef-901234567890.docx', '/uploads/assessment3/c9d0e1f2-a3b4-5678-cdef-901234567890.docx', 3584000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Integration', 'Detailed EMR integration specifications with HL7 and FHIR mappings', 3, GETDATE(), 'System Admin'),
('Medical_Device_Inventory.xlsx', 'd0e1f2a3-b4c5-6789-defa-012345678901.xlsx', '/uploads/assessment3/d0e1f2a3-b4c5-6789-defa-012345678901.xlsx', 2304000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Infrastructure', 'Inventory of connected medical devices with security assessment', 3, GETDATE(), 'System Admin'),
('Patient_Data_Flow_Diagram.pdf', 'e1f2a3b4-c5d6-7890-efab-123456789012.pdf', '/uploads/assessment3/e1f2a3b4-c5d6-7890-efab-123456789012.pdf', 2816000, 'application/pdf', 'Architecture', 'Patient data flow diagram showing all touchpoints and security controls', 3, GETDATE(), 'System Admin');

PRINT 'AssessmentFiles seeded successfully!'
SELECT COUNT(*) as [AssessmentFiles Count] FROM AssessmentFiles;