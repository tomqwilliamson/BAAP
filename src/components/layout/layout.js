// src/components/Layout/Layout.js - Main layout component
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';
import Dashboard from '../dashboard/dashboard';
import AssessmentDetail from '../assessment/assessmentdetail';
import ApplicationDetail from '../application/applicationdetail';
import SecurityAssessment from '../security/securityassessment';
import InfrastructureAssessment from '../infrastructure/infrastructureassessment';
import DataArchitecture from '../data/dataarchitecture';
import DevOpsAssessment from '../devops/devopsassessment';
import BusinessContext from '../business/businesscontext';
import ArchitectureReview from '../architecture/architecturereview';
import CloudReadiness from '../cloud/cloudreadiness';
import Recommendations from '../recommendations/recommendations';
import CreateAssessment from '../assessment/createassessment';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assessments/new" element={<CreateAssessment />} />
              <Route path="/assessments/:id" element={<AssessmentDetail />} />
              <Route path="/applications/:id" element={<ApplicationDetail />} />
              <Route path="/security" element={<SecurityAssessment />} />
              <Route path="/infrastructure" element={<InfrastructureAssessment />} />
              <Route path="/data-architecture" element={<DataArchitecture />} />
              <Route path="/devops" element={<DevOpsAssessment />} />
              <Route path="/business-context" element={<BusinessContext />} />
              <Route path="/architecture-review" element={<ArchitectureReview />} />
              <Route path="/cloud-readiness" element={<CloudReadiness />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;