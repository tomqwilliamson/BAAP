// src/components/tour/TourGetStarted.js - Final tour page with call to action
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  CheckCircle, 
  Clock, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  Sparkles,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import TourLayout from './TourLayout';

const TourGetStarted = () => {
  return (
    <TourLayout 
      currentStep="get-started" 
      prevPath="/tour/insights"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-blue-600 mb-8">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Transform</span> Your Portfolio?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of enterprises already using BAAP to accelerate their cloud transformation 
            and modernization initiatives with AI-powered insights.
          </p>
        </div>

        {/* Quick Start Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Start Free Assessment */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Free Assessment</h2>
              <p className="text-gray-600">
                Get started immediately with our self-service assessment platform. 
                Upload your documentation and begin analysis in minutes.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                Complete application portfolio assessment
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                AI-powered analysis and recommendations
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                Executive dashboard and reports
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                Cloud readiness scoring
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                Migration planning roadmap
              </div>
            </div>

            <Link
              to="/signup"
              className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Start Free Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <div className="text-center mt-4">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                Setup takes less than 5 minutes
              </div>
            </div>
          </div>

          {/* Enterprise Demo */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Enterprise Demo</h2>
              <p className="text-blue-100">
                Schedule a personalized demo to see how BAAP can accelerate 
                your specific transformation initiatives.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-blue-100">
                <CheckCircle className="h-4 w-4 text-white mr-3" />
                Custom demo with your use cases
              </div>
              <div className="flex items-center text-sm text-blue-100">
                <CheckCircle className="h-4 w-4 text-white mr-3" />
                Integration planning discussion
              </div>
              <div className="flex items-center text-sm text-blue-100">
                <CheckCircle className="h-4 w-4 text-white mr-3" />
                ROI analysis for your portfolio
              </div>
              <div className="flex items-center text-sm text-blue-100">
                <CheckCircle className="h-4 w-4 text-white mr-3" />
                Pilot project planning
              </div>
              <div className="flex items-center text-sm text-blue-100">
                <CheckCircle className="h-4 w-4 text-white mr-3" />
                Implementation roadmap
              </div>
            </div>

            <button className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-700 bg-white rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white shadow-xl transition-all duration-200 transform hover:scale-105">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </button>

            <div className="text-center mt-4">
              <div className="flex items-center justify-center text-sm text-blue-200">
                <Users className="h-4 w-4 mr-2" />
                Available for enterprise teams
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose BAAP */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Enterprises Choose BAAP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                SOC 2 Type II certified with enterprise-grade security controls, 
                ensuring your sensitive data is protected throughout the assessment process.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Proven Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Over 500 enterprise clients have achieved an average of $2.3M in cost savings 
                and 85% faster cloud migration timelines using our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated customer success team with cloud architecture expertise 
                to guide your transformation journey from assessment to implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Need Help Getting Started?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right approach for your organization's needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sales@baap.com"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              Email Sales Team
            </a>
            
            <a
              href="tel:+1-800-BAAP-HELP"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call 1-800-BAAP-HELP
            </a>
          </div>
        </div>
      </div>
    </TourLayout>
  );
};

export default TourGetStarted;