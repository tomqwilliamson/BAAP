-- Seed data for AssessmentFiles table
PRINT 'Seeding AssessmentFiles table...'

INSERT INTO AssessmentFiles (
    FileName,
    FilePath,
    FileSize,
    ContentType,
    AssessmentId,
    UploadedDate
) VALUES 
-- Files for Assessment 1 (E-commerce)
('E-commerce_Architecture_Diagram.pdf', '/uploads/assessment1/architecture_diagram.pdf', 2048000, 'application/pdf', 1, GETDATE()),
('Performance_Test_Results.xlsx', '/uploads/assessment1/performance_results.xlsx', 1536000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1, GETDATE()),
('Security_Assessment_Report.docx', '/uploads/assessment1/security_report.docx', 3072000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1, GETDATE()),

-- Files for Assessment 2 (Banking)
('Core_Banking_System_Documentation.pdf', '/uploads/assessment2/core_banking_docs.pdf', 8192000, 'application/pdf', 2, GETDATE()),
('Compliance_Audit_Report.docx', '/uploads/assessment2/compliance_audit.docx', 4096000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2, GETDATE()),
('Legacy_System_Inventory.xlsx', '/uploads/assessment2/system_inventory.xlsx', 2560000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 2, GETDATE()),
('Risk_Assessment_Matrix.xlsx', '/uploads/assessment2/risk_matrix.xlsx', 1024000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 2, GETDATE()),

-- Files for Assessment 3 (Healthcare)
('HIPAA_Compliance_Checklist.pdf', '/uploads/assessment3/hipaa_checklist.pdf', 1792000, 'application/pdf', 3, GETDATE()),
('EMR_Integration_Specification.docx', '/uploads/assessment3/emr_integration.docx', 3584000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 3, GETDATE()),
('Medical_Device_Inventory.xlsx', '/uploads/assessment3/device_inventory.xlsx', 2304000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 3, GETDATE()),
('Patient_Data_Flow_Diagram.pdf', '/uploads/assessment3/data_flow.pdf', 2816000, 'application/pdf', 3, GETDATE());

PRINT 'AssessmentFiles seeded successfully!'
SELECT COUNT(*) as [AssessmentFiles Count] FROM AssessmentFiles;