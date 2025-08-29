import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications from localStorage and connect to SignalR hub
  useEffect(() => {
    // Load from localStorage
    const savedNotifications = localStorage.getItem('baap_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    // Connect to SignalR hub
    notificationService.start();

    // Handle real-time notifications
    const cleanup = notificationService.onNotification((notification) => {
      if (notification.Type === 'analysis') {
        addAnalysisNotification(
          notification.Module,
          notification.AssessmentName,
          notification.Duration
        );
      } else {
        addSystemNotification(
          notification.Title,
          notification.Message,
          notification.Type
        );
      }
    });

    return () => {
      cleanup();
      notificationService.stop();
    };
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('baap_notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      type: 'analysis', // analysis, system, error, success
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast.success(notification.title || 'Analysis Complete', {
      duration: 4000,
      icon: getNotificationIcon(notification.module),
    });

    return newNotification.id;
  };

  // Add analysis completion notification
  const addAnalysisNotification = (module, assessmentName = null, duration = null) => {
    const moduleDisplayNames = {
      'infrastructure': 'Infrastructure & Compute',
      'security': 'Security Assessment', 
      'devops': 'DevOps & Development',
      'data-architecture': 'Data Architecture',
      'cloud-readiness': 'Cloud Readiness',
      'architecture': 'Architecture Review',
      'business-context': 'Business Context',
      'recommendations': 'AI Recommendations'
    };

    const displayName = moduleDisplayNames[module] || module;
    const assessmentText = assessmentName ? ` for ${assessmentName}` : '';
    const durationText = duration ? ` (${duration})` : '';

    return addNotification({
      title: `${displayName} Analysis Complete`,
      message: `Your ${displayName.toLowerCase()} analysis${assessmentText} has finished processing${durationText}. Click to view results.`,
      module,
      assessmentName,
      duration,
      action: {
        type: 'navigate',
        url: `/app/${module}`
      }
    });
  };

  // Add system notification
  const addSystemNotification = (title, message, type = 'system') => {
    return addNotification({
      title,
      message,
      type,
      module: 'system'
    });
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('baap_notifications');
  };

  // Get notifications with filtering and sorting
  const getNotifications = (filter = 'all') => {
    let filtered = notifications;
    
    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.read);
    } else if (filter === 'analysis') {
      filtered = notifications.filter(n => n.type === 'analysis');
    }

    // Sort by timestamp, newest first
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Toggle notification panel
  const toggleNotifications = () => {
    setIsOpen(prev => !prev);
  };

  const closeNotifications = () => {
    setIsOpen(false);
  };

  // Helper function to get appropriate icon for module
  const getNotificationIcon = (module) => {
    const icons = {
      'infrastructure': '🏗️',
      'security': '🛡️', 
      'devops': '🔧',
      'data-architecture': '🗄️',
      'cloud-readiness': '☁️',
      'architecture': '📐',
      'business-context': '💼',
      'recommendations': '🤖',
      'system': '⚙️',
      'error': '❌',
      'success': '✅'
    };
    return icons[module] || '📋';
  };

  // Helper function to get time ago string
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const value = {
    notifications: getNotifications(),
    unreadCount,
    isOpen,
    addNotification,
    addAnalysisNotification,
    addSystemNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotifications,
    toggleNotifications,
    closeNotifications,
    getNotificationIcon,
    getTimeAgo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};