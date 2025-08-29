import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, X, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { useNotifications } from '../../contexts/notificationcontext';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isOpen,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    toggleNotifications,
    closeNotifications,
    getNotificationIcon,
    getTimeAgo
  } = useNotifications();

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Handle action if present
    if (notification.action?.type === 'navigate' && notification.action?.url) {
      navigate(notification.action.url);
    }
    
    // Close dropdown
    closeNotifications();
  };

  const getNotificationTypeColor = (type) => {
    const colors = {
      'analysis': 'bg-blue-50 border-blue-200',
      'system': 'bg-gray-50 border-gray-200',
      'error': 'bg-red-50 border-red-200',
      'success': 'bg-green-50 border-green-200'
    };
    return colors[type] || colors.system;
  };

  const getNotificationTextColor = (type) => {
    const colors = {
      'analysis': 'text-blue-900',
      'system': 'text-gray-900',
      'error': 'text-red-900',
      'success': 'text-green-900'
    };
    return colors[type] || colors.system;
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={toggleNotifications}
        className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200 relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeNotifications}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute right-0 top-12 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Clear all notifications"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={closeNotifications}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Analysis completion alerts will appear here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getNotificationTypeColor(notification.type)}`}>
                            {getNotificationIcon(notification.module)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${getNotificationTextColor(notification.type)} ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {getTimeAgo(notification.timestamp)}
                            </div>
                            {notification.action && (
                              <div className="flex items-center text-xs text-blue-600">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Results
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  {notifications.length} total notification{notifications.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;