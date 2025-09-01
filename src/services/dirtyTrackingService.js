import { notificationService } from './notificationService';

class DirtyTrackingService {
    constructor() {
        this.dirtyStates = new Map(); // assessmentId -> { module: isDirty }
        this.handlers = new Map(); // assessmentId -> Set of handlers
        this.autoSaveIntervals = new Map(); // assessmentId -> intervalId
    }

    // Register a module for dirty tracking
    registerModule(assessmentId, module, initialData = {}) {
        const key = `${assessmentId}_${module}`;
        
        if (!this.dirtyStates.has(assessmentId)) {
            this.dirtyStates.set(assessmentId, {});
        }
        
        this.dirtyStates.get(assessmentId)[module] = false;
        this._notifyHandlers(assessmentId, module, false);
        
        // Set up auto-save notification every 30 seconds if dirty
        if (!this.autoSaveIntervals.has(key)) {
            const intervalId = setInterval(() => {
                const isDirty = this.isDirty(assessmentId, module);
                if (isDirty) {
                    this._sendDirtyNotification(assessmentId, module);
                }
            }, 30000); // 30 seconds
            
            this.autoSaveIntervals.set(key, intervalId);
        }
    }

    // Mark a module as dirty or clean
    setDirty(assessmentId, module, isDirty = true) {
        if (!this.dirtyStates.has(assessmentId)) {
            this.dirtyStates.set(assessmentId, {});
        }
        
        const currentState = this.dirtyStates.get(assessmentId)[module];
        if (currentState !== isDirty) {
            this.dirtyStates.get(assessmentId)[module] = isDirty;
            this._notifyHandlers(assessmentId, module, isDirty);
            
            if (isDirty) {
                this._sendDirtyNotification(assessmentId, module);
            }
        }
    }

    // Check if a module is dirty
    isDirty(assessmentId, module) {
        return this.dirtyStates.get(assessmentId)?.[module] || false;
    }

    // Check if any module in an assessment is dirty
    isAssessmentDirty(assessmentId) {
        const modules = this.dirtyStates.get(assessmentId);
        if (!modules) return false;
        
        return Object.values(modules).some(isDirty => isDirty);
    }

    // Get all dirty modules for an assessment
    getDirtyModules(assessmentId) {
        const modules = this.dirtyStates.get(assessmentId);
        if (!modules) return [];
        
        return Object.entries(modules)
            .filter(([_, isDirty]) => isDirty)
            .map(([module, _]) => module);
    }

    // Listen to dirty state changes for a specific module
    onDirtyStateChange(assessmentId, module, handler) {
        const key = `${assessmentId}_${module}`;
        
        if (!this.handlers.has(key)) {
            this.handlers.set(key, new Set());
        }
        
        this.handlers.get(key).add(handler);
        
        // Call handler with current state
        handler(this.isDirty(assessmentId, module));
        
        // Return cleanup function
        return () => {
            this.handlers.get(key)?.delete(handler);
        };
    }

    // Listen to dirty state changes for entire assessment
    onAssessmentDirtyStateChange(assessmentId, handler) {
        const assessmentKey = `assessment_${assessmentId}`;
        
        if (!this.handlers.has(assessmentKey)) {
            this.handlers.set(assessmentKey, new Set());
        }
        
        this.handlers.get(assessmentKey).add(handler);
        
        // Call handler with current state
        handler(this.isAssessmentDirty(assessmentId), this.getDirtyModules(assessmentId));
        
        // Return cleanup function
        return () => {
            this.handlers.get(assessmentKey)?.delete(handler);
        };
    }

    // Clean up tracking for a module
    unregisterModule(assessmentId, module) {
        const key = `${assessmentId}_${module}`;
        
        // Clear auto-save interval
        if (this.autoSaveIntervals.has(key)) {
            clearInterval(this.autoSaveIntervals.get(key));
            this.autoSaveIntervals.delete(key);
        }
        
        // Remove dirty state
        if (this.dirtyStates.has(assessmentId)) {
            delete this.dirtyStates.get(assessmentId)[module];
        }
        
        // Clear handlers
        this.handlers.delete(key);
    }

    // Clean up entire assessment
    unregisterAssessment(assessmentId) {
        // Clear all module intervals for this assessment
        const modules = this.dirtyStates.get(assessmentId);
        if (modules) {
            Object.keys(modules).forEach(module => {
                this.unregisterModule(assessmentId, module);
            });
        }
        
        // Clear assessment-level handlers
        this.handlers.delete(`assessment_${assessmentId}`);
        
        // Remove dirty state
        this.dirtyStates.delete(assessmentId);
    }

    // Send SignalR notification about dirty state
    async _sendDirtyNotification(assessmentId, module) {
        try {
            await notificationService.sendProgressUpdate(
                assessmentId, 
                'dirty_save_reminder', 
                0, 
                `${this._getModuleDisplayName(module)} has unsaved changes`
            );
        } catch (error) {
            console.warn('Failed to send dirty notification via SignalR:', error);
        }
    }

    // Notify handlers about state changes
    _notifyHandlers(assessmentId, module, isDirty) {
        // Notify module-specific handlers
        const moduleKey = `${assessmentId}_${module}`;
        this.handlers.get(moduleKey)?.forEach(handler => handler(isDirty));
        
        // Notify assessment-level handlers
        const assessmentKey = `assessment_${assessmentId}`;
        const assessmentIsDirty = this.isAssessmentDirty(assessmentId);
        const dirtyModules = this.getDirtyModules(assessmentId);
        this.handlers.get(assessmentKey)?.forEach(handler => handler(assessmentIsDirty, dirtyModules));
    }

    // Get user-friendly module names
    _getModuleDisplayName(module) {
        const moduleNames = {
            'infrastructure': 'Infrastructure Assessment',
            'security': 'Security Assessment',
            'devops': 'DevOps Assessment',
            'data-architecture': 'Data Architecture Assessment',
            'architecture': 'Architecture Review',
            'business-context': 'Business Context',
            'cloud-readiness': 'Cloud Readiness',
            'recommendations': 'Recommendations'
        };
        return moduleNames[module] || module;
    }

    // Utility method to start AI analysis with progress tracking
    async startAIAnalysis(assessmentId, module, analysisFunction) {
        const moduleName = this._getModuleDisplayName(module);
        
        try {
            // Send start notification
            await notificationService.sendProgressUpdate(
                assessmentId, 
                'ai_analysis_started', 
                0, 
                `Starting ${moduleName} AI analysis...`
            );
            
            // Execute analysis function
            const startTime = Date.now();
            const result = await analysisFunction();
            const duration = Math.round((Date.now() - startTime) / 1000);
            
            // Send completion notification
            await notificationService.sendAnalysisNotification(
                module,
                `Assessment ${assessmentId}`,
                `${duration}s`
            );
            
            await notificationService.sendProgressUpdate(
                assessmentId, 
                'ai_analysis_completed', 
                100, 
                `${moduleName} AI analysis completed in ${duration}s`
            );
            
            return result;
        } catch (error) {
            // Send error notification
            await notificationService.sendProgressUpdate(
                assessmentId, 
                'ai_analysis_failed', 
                0, 
                `${moduleName} AI analysis failed: ${error.message}`
            );
            throw error;
        }
    }
}

export const dirtyTrackingService = new DirtyTrackingService();