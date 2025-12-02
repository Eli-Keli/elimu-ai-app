/**
 * React Error Boundary for Elimu AI application
 * Catches JavaScript errors in component tree and displays fallback UI
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { logger } from './logger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error details
        logger.error('ErrorBoundary', 'Caught error in component tree', {
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });

        this.setState({
            error,
            errorInfo,
        });

        // TODO: Send error to analytics service (Sentry, Firebase Crashlytics)
        // reportErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReportBug = () => {
        // TODO: Implement bug reporting
        // - Copy error details to clipboard
        // - Open email with pre-filled error report
        // - Or send to bug tracking system
        const errorReport = logger.exportLogs();
        console.log('Bug Report:', errorReport);
        alert('Bug reporting will be implemented in a future version.');
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.emoji}>😵</Text>
                        <Text style={styles.title}>Oops! Something went wrong</Text>
                        <Text style={styles.message}>
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.errorDetails}>
                                <Text style={styles.errorTitle}>Error Details (Dev Mode):</Text>
                                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                                {this.state.error.stack && (
                                    <Text style={styles.stackTrace}>{this.state.error.stack}</Text>
                                )}
                            </View>
                        )}

                        <View style={styles.actions}>
                            <Button title="Try Again" onPress={this.handleReset} />
                            <Button
                                title="Report Bug"
                                onPress={this.handleReportBug}
                                style={{ backgroundColor: colors.secondary }}
                            />
                        </View>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    errorDetails: {
        width: '100%',
        backgroundColor: '#FFF3CD',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#856404',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#856404',
        fontFamily: 'monospace',
        marginBottom: 8,
    },
    stackTrace: {
        fontSize: 10,
        color: '#856404',
        fontFamily: 'monospace',
        lineHeight: 14,
    },
    actions: {
        width: '100%',
        gap: 10,
    },
});
