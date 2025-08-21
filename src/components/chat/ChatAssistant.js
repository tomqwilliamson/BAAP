import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m ARIA, your Assessment & Recommendations Intelligence Assistant. I can help you with questions about your application assessments, security analysis, cloud readiness, and provide guidance on using BAAP. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentAssessment } = useAssessment();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Simple keyword-based responses for demo purposes
    if (input.includes('security') || input.includes('vulnerability')) {
      return 'Based on your current assessment, I can help you with security-related questions. Security assessments in BAAP cover vulnerability scanning, compliance checks, and risk analysis. Would you like me to explain any specific security metrics or help you interpret your security scores?';
    }
    
    if (input.includes('cloud') || input.includes('migration')) {
      return 'Cloud readiness assessment is one of BAAP\'s key features. I can help you understand cloud migration strategies, cost analysis, and readiness scores. Your applications are evaluated for containerization potential, cloud-native features, and migration complexity. What specific aspect of cloud migration would you like to discuss?';
    }
    
    if (input.includes('assessment') || input.includes('analysis')) {
      return currentAssessment 
        ? `You're currently working on "${currentAssessment.name}". I can help explain assessment results, scoring methodology, or guide you through different assessment modules. What would you like to know about your current assessment?`
        : 'BAAP provides comprehensive application assessments covering architecture, security, infrastructure, data, DevOps practices, and cloud readiness. Each assessment generates detailed reports with actionable recommendations. Would you like me to guide you through starting a new assessment?';
    }
    
    if (input.includes('help') || input.includes('how to') || input.includes('guide')) {
      return 'I can help you navigate BAAP and understand your assessment results. Here are some things I can assist with:\n\n• Explaining assessment scores and metrics\n• Interpreting security and compliance results\n• Understanding cloud readiness recommendations\n• Guidance on using different BAAP modules\n• Best practices for application modernization\n\nWhat specific area would you like help with?';
    }
    
    if (input.includes('score') || input.includes('rating') || input.includes('results')) {
      return 'Assessment scores in BAAP are calculated based on multiple factors including security posture, architectural quality, cloud readiness, and operational maturity. Each module uses weighted scoring algorithms to provide meaningful insights. I can help you understand what these scores mean and how to improve them. Which scores would you like me to explain?';
    }
    
    if (input.includes('recommendation') || input.includes('suggest')) {
      return 'BAAP\'s AI-powered recommendations are based on your assessment results and industry best practices. They include prioritized action items, cost-benefit analysis, and implementation roadmaps. I can help you understand these recommendations and how to act on them. Would you like me to explain any specific recommendations?';
    }
    
    // Default response
    return 'I\'m here to help with questions about your application assessments, BAAP features, security analysis, cloud readiness, and modernization strategies. Could you please be more specific about what you\'d like to know? For example, you can ask about assessment scores, security findings, cloud migration recommendations, or how to use specific BAAP features.';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold">ARIA - AI Assessment Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-xs">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask ARIA about your assessments..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ask about assessments, security findings, cloud readiness, or BAAP features
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatAssistant;