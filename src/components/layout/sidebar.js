// src/components/Layout/Sidebar.js - Left sidebar navigation
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  Cloud, 
  Database, 
  GitBranch, 
  Building, 
  Layers, 
  CloudCog,
  Target,
  Plus,
  Home,
  ChevronDown,
  ChevronRight,
  FileText,
  Settings,
  Users,
  TrendingUp,
  Brain,
  Factory
} from 'lucide-react';
import classNames from 'classnames';

// Color scheme for categories and icons
const categoryColors = {
  'Dashboard': { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600', activeBg: 'bg-green-50' },
  'Assessment Framework': { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600', activeBg: 'bg-blue-50' },
  'Technical Assessment': { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600', activeBg: 'bg-purple-50' },
  'Cloud & Modernization': { bg: 'bg-sky-100', text: 'text-sky-700', icon: 'text-sky-600', activeBg: 'bg-sky-50' },
  'AI Intelligence': { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-600', activeBg: 'bg-orange-50' },
  'Results & Insights': { bg: 'bg-teal-100', text: 'text-teal-700', icon: 'text-teal-600', activeBg: 'bg-teal-50' }
};

// Child item specific colors
const childColors = {
  // Assessment Framework
  'Business Context': 'text-blue-500',
  'Architecture Review': 'text-indigo-500',
  
  // Technical Assessment  
  'Infrastructure & Compute': 'text-sky-500',
  'Data Architecture': 'text-cyan-500',
  'DevOps & Development': 'text-green-500',
  'Security Assessment': 'text-red-500',
  
  // Cloud & Modernization
  'Cloud Readiness': 'text-sky-500',
  
  // AI Intelligence
  'Industry Classification': 'text-orange-500',
  
  // Results & Insights
  'Recommendations': 'text-teal-500'
};

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',
    icon: Home,
    current: false
  },
  {
    name: 'Assessment Framework',
    icon: FileText,
    children: [
      {
        name: 'Business Context',
        href: '/app/business-context',
        icon: Building,
        description: 'Business drivers and stakeholders'
      },
      {
        name: 'Architecture Review',
        href: '/app/architecture-review',
        icon: Layers,
        description: 'Application portfolio analysis'
      }
    ]
  },
  {
    name: 'Technical Assessment',
    icon: Settings,
    children: [
      {
        name: 'Infrastructure & Compute',
        href: '/app/infrastructure',
        icon: Cloud,
        description: 'Hosting environment and cloud readiness'
      },
      {
        name: 'Data Architecture',
        href: '/app/data-architecture',
        icon: Database,
        description: 'Data stores and integration patterns'
      },
      {
        name: 'DevOps & Development',
        href: '/app/devops',
        icon: GitBranch,
        description: 'CI/CD pipelines and practices'
      },
      {
        name: 'Security Assessment',
        href: '/app/security',
        icon: Shield,
        description: 'Application and infrastructure security'
      }
    ]
  },
  {
    name: 'Cloud & Modernization',
    icon: CloudCog,
    children: [
      {
        name: 'Cloud Readiness',
        href: '/app/cloud-readiness',
        icon: Cloud,
        description: 'Migration strategies and readiness'
      }
    ]
  },
  {
    name: 'AI Intelligence',
    icon: Brain,
    children: [
      {
        name: 'Industry Classification',
        href: '/app/industry-classification',
        icon: Factory,
        description: 'Industry-specific analysis and recommendations'
      }
    ]
  },
  {
    name: 'Results & Insights',
    icon: TrendingUp,
    children: [
      {
        name: 'Recommendations',
        href: '/app/recommendations',
        icon: Target,
        description: 'AI-generated improvement suggestions'
      }
    ]
  }
];

function NavItem({ item, isExpanded, onToggle }) {
  const location = useLocation();
  const isActive = item.href && location.pathname === item.href;
  const hasActiveChild = item.children?.some(child => location.pathname === child.href);
  const colors = categoryColors[item.name] || categoryColors['Dashboard'];

  if (item.children) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={classNames(
            'w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-md transition-colors duration-200',
            hasActiveChild
              ? `${colors.bg} ${colors.text}`
              : `text-gray-700 hover:${colors.activeBg} hover:${colors.text}`
          )}
        >
          <div className="flex items-center">
            <item.icon className={classNames(
              "mr-3 h-5 w-5",
              hasActiveChild ? colors.icon : `${colors.icon} group-hover:${colors.icon}`
            )} />
            {item.name}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map((child) => {
              const isChildActive = location.pathname === child.href;
              const childIconColor = childColors[child.name] || colors.icon;
              
              return (
                <Link
                  key={child.name}
                  to={child.href}
                  className={classNames(
                    'group flex items-start px-3 py-2 text-sm rounded-md transition-colors duration-200',
                    isChildActive
                      ? `${colors.activeBg} ${colors.text} border-r-2 ${colors.icon.replace('text-', 'border-')}`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <child.icon className={classNames(
                    "mr-3 h-4 w-4 mt-0.5 flex-shrink-0",
                    isChildActive ? colors.icon : childIconColor
                  )} />
                  <div>
                    <div className="font-medium">{child.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {child.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={classNames(
        'group flex items-center px-3 py-2 text-sm font-bold rounded-md transition-colors duration-200',
        isActive
          ? `${colors.bg} ${colors.text}`
          : `text-gray-700 hover:${colors.activeBg} hover:${colors.text}`
      )}
    >
      <item.icon className={classNames(
        "mr-3 h-5 w-5",
        isActive ? colors.icon : `${colors.icon} group-hover:${colors.icon}`
      )} />
      {item.name}
    </Link>
  );
}

function Sidebar() {
  const [expandedItems, setExpandedItems] = useState({
    'Assessment Framework': true,
    'Technical Assessment': true,
    'Cloud & Modernization': false,
    'AI Intelligence': true,
    'Results & Insights': true
  });

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">BAAP Assessment</h1>
            <p className="text-xs text-gray-500">AI-Powered Assessment Platform</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <Link
          to="/assessments/new"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isExpanded={expandedItems[item.name]}
            onToggle={() => toggleExpanded(item.name)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="font-medium">BAAP v1.0</div>
          <div>Powered by Quisitive</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;