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
  TrendingUp
} from 'lucide-react';
import classNames from 'classnames';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: false
  },
  {
    name: 'Assessment Framework',
    icon: FileText,
    children: [
      {
        name: 'Business Context',
        href: '/business-context',
        icon: Building,
        description: 'Business drivers and stakeholders'
      },
      {
        name: 'Architecture Review',
        href: '/architecture-review',
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
        href: '/infrastructure',
        icon: Cloud,
        description: 'Hosting environment and cloud readiness'
      },
      {
        name: 'Data Architecture',
        href: '/data-architecture',
        icon: Database,
        description: 'Data stores and integration patterns'
      },
      {
        name: 'DevOps & Development',
        href: '/devops',
        icon: GitBranch,
        description: 'CI/CD pipelines and practices'
      },
      {
        name: 'Security Assessment',
        href: '/security',
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
        href: '/cloud-readiness',
        icon: Cloud,
        description: 'Migration strategies and readiness'
      }
    ]
  },
  {
    name: 'Results & Insights',
    icon: TrendingUp,
    children: [
      {
        name: 'Recommendations',
        href: '/recommendations',
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

  if (item.children) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={classNames(
            'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
            hasActiveChild
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <div className="flex items-center">
            <item.icon className="mr-3 h-5 w-5" />
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
            {item.children.map((child) => (
              <Link
                key={child.name}
                to={child.href}
                className={classNames(
                  'group flex items-start px-3 py-2 text-sm rounded-md transition-colors duration-200',
                  location.pathname === child.href
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <child.icon className="mr-3 h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{child.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {child.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={classNames(
        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </Link>
  );
}

function Sidebar() {
  const [expandedItems, setExpandedItems] = useState({
    'Assessment Framework': true,
    'Technical Assessment': true,
    'Cloud & Modernization': false,
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
            <h1 className="text-lg font-bold text-gray-900">Assessment</h1>
            <p className="text-xs text-gray-500">AI-Powered Platform</p>
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
          <div className="font-medium">Assessment Platform v1.0</div>
          <div>Powered by AI Analysis</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;