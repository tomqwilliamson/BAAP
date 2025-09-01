-- Seed data for ArchitecturePatterns table
PRINT 'Seeding ArchitecturePatterns table...'

INSERT INTO ArchitecturePatterns (
    PatternName,
    [Description],
    Justification,
    ImplementationNotes,
    ArchitectureReviewId,
    CreatedDate
) VALUES 
-- Patterns for Architecture Review 1 (E-commerce)
('API Gateway Pattern', 'Centralized entry point for all client requests with routing, authentication, and rate limiting', 'Provides unified interface for microservices and enables centralized cross-cutting concerns', 'Implement using Azure API Management or AWS API Gateway with OAuth 2.0 authentication', 1, GETDATE()),
('Database Per Service', 'Each microservice owns its data and database, ensuring loose coupling', 'Enables independent scaling and technology choices per service while maintaining data consistency', 'Use SQL databases for transactional services, NoSQL for catalog and recommendations services', 1, GETDATE()),
('Event-Driven Architecture', 'Asynchronous communication between services using events and message queues', 'Improves scalability and resilience by decoupling services and enabling eventual consistency', 'Implement using Azure Service Bus or Apache Kafka for high-throughput event streaming', 1, GETDATE()),

-- Patterns for Architecture Review 2 (Banking)
('CQRS (Command Query Responsibility Segregation)', 'Separate read and write operations for better performance and scalability', 'Critical for banking systems requiring high transaction throughput and complex reporting', 'Use separate databases optimized for writes (OLTP) and reads (OLAP) with event sourcing', 2, GETDATE()),
('Saga Pattern', 'Manage distributed transactions across microservices using compensating actions', 'Essential for financial transactions requiring ACID properties across multiple services', 'Implement orchestration-based sagas for complex financial workflows with rollback capabilities', 2, GETDATE()),
('Circuit Breaker Pattern', 'Prevent cascading failures by monitoring and isolating failing services', 'Protects critical banking operations from service failures and maintains system stability', 'Use libraries like Hystrix or Polly with configurable failure thresholds and fallback mechanisms', 2, GETDATE()),

-- Patterns for Architecture Review 3 (Healthcare)
('FHIR Facade Pattern', 'Standardized healthcare data exchange using FHIR (Fast Healthcare Interoperability Resources)', 'Enables seamless integration with external healthcare systems and EHR platforms', 'Implement FHIR R4 compliant APIs with proper security and consent management', 3, GETDATE()),
('Multi-tenant Architecture', 'Support multiple healthcare organizations with data isolation and shared infrastructure', 'Provides cost-effective solution for healthcare SaaS while maintaining strict data separation', 'Use tenant-aware routing and separate schemas per tenant with shared application logic', 3, GETDATE()),
('Audit Log Pattern', 'Comprehensive logging of all patient data access and modifications for compliance', 'Required for HIPAA compliance and provides audit trail for regulatory requirements', 'Implement immutable audit logs with encryption and long-term retention policies', 3, GETDATE());

PRINT 'ArchitecturePatterns seeded successfully!'
SELECT COUNT(*) as [ArchitecturePatterns Count] FROM ArchitecturePatterns;