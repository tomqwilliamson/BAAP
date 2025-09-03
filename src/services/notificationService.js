import * as signalR from '@microsoft/signalr';

class NotificationService {
    constructor() {
        this.connection = null;
        this.handlers = [];
        this.enabled = false; // Disable SignalR by default to avoid SSL certificate issues in development
        this.connectionAttempted = false;
    }

    get isEnabled() {
        return this.enabled;
    }

    async start() {
        if (!this.enabled || this.connectionAttempted) {
            if (!this.enabled) {
                console.info('ℹ️ Real-time notifications disabled - SignalR hub not configured');
            }
            return;
        }

        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            return;
        }

        this.connectionAttempted = true;

        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7000/api';
        const hubUrl = apiBaseUrl.replace('/api', '/hubs/notification');
        
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                // Handle SSL certificate issues in development
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
                headers: {
                    'Access-Control-Allow-Credentials': 'true'
                },
                timeout: 30000 // 30 second timeout
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals
            .configureLogging(signalR.LogLevel.Information) // More detailed logging for debugging
            .build();

        // Handle notifications
        this.connection.on('ReceiveNotification', (notification) => {
            this.handlers.forEach(handler => handler(notification));
        });

        // Handle connection closed
        this.connection.onclose(() => {
            console.info('ℹ️ SignalR connection closed');
        });

        // Handle reconnecting
        this.connection.onreconnecting(() => {
            console.info('ℹ️ SignalR reconnecting...');
        });

        // Handle reconnected
        this.connection.onreconnected(() => {
            console.log('✅ SignalR reconnected');
        });

        try {
            await this.connection.start();
            console.log('✅ Connected to notification hub');
        } catch (err) {
            console.warn(`⚠️ SignalR hub connection failed: ${err.message}`);
            
            // Common SSL certificate issue in development
            if (err.message.includes('Failed to fetch') || err.message.includes('negotiation')) {
                console.info('💡 To fix SSL certificate issues:');
                console.info('   1. Open https://localhost:7000/swagger in a new tab');
                console.info('   2. Accept the SSL certificate warning');
                console.info('   3. Refresh this page');
            }
            
            console.info('ℹ️ Running without real-time notifications - app continues to work normally');
            this.enabled = false; // Disable to prevent future connection attempts
            this.connection = null;
        }
    }

    // Method to enable SignalR when backend is properly configured
    enable() {
        this.enabled = true;
    }

    // Method to disable SignalR
    disable() {
        this.enabled = false;
        if (this.connection) {
            this.stop();
        }
    }

    onNotification(handler) {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter(h => h !== handler);
        };
    }

    async stop() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
        }
    }

    // Join assessment group for real-time collaboration
    async joinAssessment(assessmentId) {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke('JoinAssessmentGroup', assessmentId.toString());
        }
    }

    // Leave assessment group
    async leaveAssessment(assessmentId) {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke('LeaveAssessmentGroup', assessmentId.toString());
        }
    }

    // Send AI analysis notification
    async sendAnalysisNotification(module, assessmentName = null, duration = null) {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke('SendAnalysisNotification', module, assessmentName, duration);
        }
    }

    // Send progress update for AI analysis
    async sendProgressUpdate(assessmentId, stage, percentage, message = null) {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke('SendProgressUpdate', assessmentId.toString(), stage, percentage, message);
        }
    }

    // Add listeners for different SignalR events
    onProgressUpdate(handler) {
        if (this.connection) {
            this.connection.on('ProgressUpdate', handler);
            return () => this.connection.off('ProgressUpdate', handler);
        }
        return () => {};
    }

    onUserJoined(handler) {
        if (this.connection) {
            this.connection.on('UserJoinedAssessment', handler);
            return () => this.connection.off('UserJoinedAssessment', handler);
        }
        return () => {};
    }

    onUserLeft(handler) {
        if (this.connection) {
            this.connection.on('UserLeftAssessment', handler);
            return () => this.connection.off('UserLeftAssessment', handler);
        }
        return () => {};
    }
}

export const notificationService = new NotificationService();
