import * as signalR from '@microsoft/signalr';

class NotificationService {
    constructor() {
        this.connection = null;
        this.handlers = [];
    }

    async start() {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/notification')
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
            console.error('❌ Error connecting to notification hub:', err);
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
