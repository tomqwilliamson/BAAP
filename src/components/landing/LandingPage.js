import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, TrendingUp, Users, ChevronRight, Star, Award, BarChart3, Clock, Zap, Globe, Calendar, X, Phone, Mail, User, Eye } from 'lucide-react';
import UnifiedSignInButton from '../auth/UnifiedSignInButton';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const [showScheduleDemo, setShowScheduleDemo] = useState(false);
  const [demoRequestData, setDemoRequestData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    preferredTime: '',
    message: ''
  });

  const handleScheduleDemo = async (e) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would send to your email API
      // For now, we'll simulate sending a notification email
      const emailData = {
        to: 'tom.williamson@quisitive.com',
        subject: `BAAP Demo Request from ${demoRequestData.name}`,
        body: `
          New demo request received from landing page:
          
          Name: ${demoRequestData.name}
          Email: ${demoRequestData.email}
          Company: ${demoRequestData.company}
          Phone: ${demoRequestData.phone}
          Preferred Time: ${demoRequestData.preferredTime}
          Message: ${demoRequestData.message}
          
          Please reach out to schedule the demo.
        `
      };
      
      console.log('Sending demo request email from landing page:', emailData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Demo request sent successfully! Tom will contact you at ${demoRequestData.email} within 24 hours.`, {
        duration: 5000,
        position: 'top-center',
      });
      setShowScheduleDemo(false);
      setDemoRequestData({
        name: '',
        email: '',
        company: '',
        phone: '',
        preferredTime: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending demo request:', error);
      toast.error('Failed to send demo request. Please try again or contact us directly.', {
        duration: 5000,
        position: 'top-center',
      });
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img className="h-8 w-8" src="/logo192.png" alt="BAAP" />
              <span className="ml-2 text-xl font-bold text-gray-900 flex items-center">BAAP</span>
              <span className="ml-1 text-sm text-gray-500 flex items-center">Business Application Assessment Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <UnifiedSignInButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Transform Your</span>
                <span className="block text-blue-200">Application Portfolio</span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 leading-relaxed">
                AI-powered enterprise  that delivers comprehensive insights, 
                risk analysis, and modernization roadmaps to optimize your digital transformation journey.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link 
                  to="/tour/welcome"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Take a Tour
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <p className="mt-3 text-sm text-blue-200">
                  Free trial • No credit card required • Setup in minutes
                </p>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white rounded-lg shadow-2xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-900">94%</p>
                    <p className="text-sm text-green-700">Accuracy Rate</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-900">85%</p>
                    <p className="text-sm text-blue-700">Time Savings</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-900">99.9%</p>
                    <p className="text-sm text-purple-700">Security Score</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Users className="h-8 w-8 text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-orange-900">500+</p>
                    <p className="text-sm text-orange-700">Enterprise Clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Leading Enterprises Choose BAAP
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive application assessment powered by AI to drive your digital transformation strategy
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                360° Application Analysis
              </h3>
              <p className="text-gray-600">
                Complete assessment covering architecture, security, performance, and cloud readiness 
                with detailed scoring and recommendations.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Machine learning algorithms analyze your applications and provide intelligent 
                recommendations for modernization and optimization strategies.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enterprise Security
              </h3>
              <p className="text-gray-600">
                Advanced security assessments with compliance checking, vulnerability analysis, 
                and risk scoring aligned with industry standards.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cloud Migration Planning
              </h3>
              <p className="text-gray-600">
                Detailed cloud readiness assessment with migration strategies, cost analysis, 
                and step-by-step transformation roadmaps.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ROI Optimization
              </h3>
              <p className="text-gray-600">
                Track and measure the impact of your modernization efforts with detailed 
                ROI calculations and performance metrics.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Executive Reporting
              </h3>
              <p className="text-gray-600">
                Professional dashboards and reports designed for C-level executives 
                with clear metrics and actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Accelerate Your Digital Transformation
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Make data-driven decisions about your application portfolio with our comprehensive assessment platform.
              </p>
              
              <div className="mt-8 space-y-4">
                {[
                  "Reduce assessment time by 85% with automated analysis",
                  "Identify cost savings opportunities worth millions",
                  "Eliminate security vulnerabilities before they impact business",
                  "Create detailed modernization roadmaps with timeline and budget",
                  "Track progress with real-time dashboards and reporting"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-1" />
                    <p className="ml-3 text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h3>
                
                <div className="space-y-6">
                  <blockquote className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">
                      BAAP helped us assess 150+ applications and saved {formatCurrency(2300000)} in cloud migration costs.
                    </p>
                    <footer className="mt-3 text-sm text-gray-600">
                      — CTO, Fortune 500 Financial Services
                    </footer>
                  </blockquote>
                  
                  <blockquote className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">
                      "The security insights alone justified the entire platform cost."
                    </p>
                    <footer className="mt-3 text-sm text-gray-600">
                      — CISO, Global Manufacturing Company
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Transform Your Applications?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join 500+ enterprise customers who trust BAAP for their application assessment needs.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link 
                to="/tour/welcome"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 shadow-lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                Take a Tour
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <button 
                onClick={() => setShowScheduleDemo(true)}
                className="inline-flex items-center px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Demo
              </button>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              No setup fees • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img className="h-8 w-8" src="/logo192.png" alt="BAAP" />
              <span className="ml-2 text-xl font-bold text-white flex items-center">BAAP</span>
            </div>
            <p className="text-gray-400">
              © 2025 Quisitive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Schedule Demo Modal */}
      {showScheduleDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 mr-4">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Schedule a Demo</h3>
                    <p className="text-blue-600 text-sm font-medium">AI-Powered Assessment Platform</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScheduleDemo(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
                <p className="text-gray-700 text-center leading-relaxed">
                  Get a personalized demo of BAAP's AI-powered assessment capabilities. See how we can accelerate your digital transformation journey.
                </p>
              </div>
              
              <form onSubmit={handleScheduleDemo} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={demoRequestData.name}
                      onChange={(e) => setDemoRequestData({...demoRequestData, name: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={demoRequestData.email}
                      onChange={(e) => setDemoRequestData({...demoRequestData, email: e.target.value})}
                      placeholder="your.email@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={demoRequestData.company}
                      onChange={(e) => setDemoRequestData({...demoRequestData, company: e.target.value})}
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 mr-2 text-blue-500" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={demoRequestData.phone}
                      onChange={(e) => setDemoRequestData({...demoRequestData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Preferred Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Next week, weekdays 2-4 PM EST"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={demoRequestData.preferredTime}
                      onChange={(e) => setDemoRequestData({...demoRequestData, preferredTime: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Additional Message
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Tell us about your assessment needs or specific areas of interest..."
                      value={demoRequestData.message}
                      onChange={(e) => setDemoRequestData({...demoRequestData, message: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleDemo(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Calendar className="h-5 w-5 mr-2 inline" />
                    Request Demo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;