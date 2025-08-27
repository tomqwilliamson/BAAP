-- Reset and Seed Database Script
-- This script clears all existing data and resets identity columns
-- Run this before starting the API to get fresh seed data

USE BaapDb;
GO

-- Disable foreign key constraints
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"
GO

-- Delete all data from tables (in correct order due to foreign keys)
DELETE FROM CodeMetrics;
DELETE FROM SecurityFindings;
DELETE FROM Recommendations;
DELETE FROM BusinessDrivers;
DELETE FROM Stakeholders;
DELETE FROM DashboardMetrics;
DELETE FROM Applications;
DELETE FROM Assessments;
GO

-- Re-enable foreign key constraints
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"
GO

-- Reset identity columns to start from 1
DBCC CHECKIDENT ('Assessments', RESEED, 0);
DBCC CHECKIDENT ('Applications', RESEED, 0);
DBCC CHECKIDENT ('BusinessDrivers', RESEED, 0);
DBCC CHECKIDENT ('CodeMetrics', RESEED, 0);
DBCC CHECKIDENT ('DashboardMetrics', RESEED, 0);
DBCC CHECKIDENT ('Recommendations', RESEED, 0);
DBCC CHECKIDENT ('SecurityFindings', RESEED, 0);
DBCC CHECKIDENT ('Stakeholders', RESEED, 0);
GO

PRINT 'Database cleared and ready for seeding.'
PRINT 'Start the BAAP API application to automatically seed with fresh data.'