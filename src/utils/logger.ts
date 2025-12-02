/**
 * Centralized logging utility for Elimu AI application
 * Provides structured logging with different levels and emoji prefixes for easy visual scanning
 */

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

interface LogEntry {
    level: LogLevel;
    module: string;
    message: string;
    data?: any;
    timestamp: string;
}

class Logger {
    private isDevelopment = __DEV__;
    private logs: LogEntry[] = [];
    private maxLogs = 1000; // Keep last 1000 logs in memory

    /**
     * Log a debug message (development only)
     */
    debug(module: string, message: string, data?: any) {
        if (this.isDevelopment) {
            this.log(LogLevel.DEBUG, module, message, data);
        }
    }

    /**
     * Log an informational message
     */
    info(module: string, message: string, data?: any) {
        this.log(LogLevel.INFO, module, message, data);
    }

    /**
     * Log a warning message
     */
    warn(module: string, message: string, data?: any) {
        this.log(LogLevel.WARN, module, message, data);
    }

    /**
     * Log an error message
     */
    error(module: string, message: string, error?: any) {
        this.log(LogLevel.ERROR, module, message, error);
    }

    /**
     * Internal logging method
     */
    private log(level: LogLevel, module: string, message: string, data?: any) {
        const entry: LogEntry = {
            level,
            module,
            message,
            data,
            timestamp: new Date().toISOString(),
        };

        // Store in memory
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift(); // Remove oldest log
        }

        // Console output with emoji prefixes
        const emoji = this.getEmojiForLevel(level);
        const prefix = `${emoji} [${module}]`;

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(prefix, message, data || '');
                break;
            case LogLevel.INFO:
                console.info(prefix, message, data || '');
                break;
            case LogLevel.WARN:
                console.warn(prefix, message, data || '');
                break;
            case LogLevel.ERROR:
                console.error(prefix, message, data || '');
                if (data instanceof Error) {
                    console.error(data.stack);
                }
                break;
        }
    }

    /**
     * Get emoji prefix for log level
     */
    private getEmojiForLevel(level: LogLevel): string {
        switch (level) {
            case LogLevel.DEBUG:
                return '🐛';
            case LogLevel.INFO:
                return 'ℹ️';
            case LogLevel.WARN:
                return '⚠️';
            case LogLevel.ERROR:
                return '❌';
            default:
                return '📝';
        }
    }

    /**
     * Get all logs (useful for debugging or bug reports)
     */
    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    /**
     * Clear all stored logs
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * Export logs as formatted string
     */
    exportLogs(): string {
        return this.logs
            .map(entry =>
                `[${entry.timestamp}] ${entry.level} [${entry.module}] ${entry.message}${entry.data ? `\n  Data: ${JSON.stringify(entry.data, null, 2)}` : ''
                }`
            )
            .join('\n\n');
    }
}

// Singleton instance
export const logger = new Logger();

// Convenience functions for common modules
export const aiLogger = {
    debug: (msg: string, data?: any) => logger.debug('AI', msg, data),
    info: (msg: string, data?: any) => logger.info('AI', msg, data),
    warn: (msg: string, data?: any) => logger.warn('AI', msg, data),
    error: (msg: string, error?: any) => logger.error('AI', msg, error),
};

export const uiLogger = {
    debug: (msg: string, data?: any) => logger.debug('UI', msg, data),
    info: (msg: string, data?: any) => logger.info('UI', msg, data),
    warn: (msg: string, data?: any) => logger.warn('UI', msg, data),
    error: (msg: string, error?: any) => logger.error('UI', msg, error),
};

export const storageLogger = {
    debug: (msg: string, data?: any) => logger.debug('Storage', msg, data),
    info: (msg: string, data?: any) => logger.info('Storage', msg, data),
    warn: (msg: string, data?: any) => logger.warn('Storage', msg, data),
    error: (msg: string, error?: any) => logger.error('Storage', msg, error),
};
