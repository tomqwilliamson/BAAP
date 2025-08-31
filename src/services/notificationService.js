import * as signalR from '@microsoft/signalr';

class NotificationService {
    constructor() {
        this.connection = null;
        this.handlers = [];
        this.enabled = false; // Disable by default until backend is properly configured
    }

    get isEnabled() {
        return this.enabled;
    }

    async start() {
        if (!this.enabled) {
            console.info('ℹ️ Real-time notifications disabled - SignalR hub not configured');
            return;
        }

        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:3000/hubs/notification')
            .withAutomaticReconnect()
            .build();

        // Handle notifications
        this.connection.on('ReceiveNotification', (notification) => {
            this.handlers.forEach(handler => handler(notification));
        });

        try {
            await this.connection.start();
            console.log('✅ Connected to notification hub');
        } catch (err) {
            console.info('ℹ️ SignalR hub connection failed - running without real-time notifications');
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
}

export const notificationService = new NotificationService();
