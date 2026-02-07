import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-red-100 calm-shadow">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-4">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>

                        <h1 className="text-2xl font-bold text-center text-accent mb-2">
                            Something Went Wrong
                        </h1>

                        <p className="text-sm text-neutral/60 text-center mb-6">
                            Meowmo encountered an unexpected error. Your data is safe—try reloading the app.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 p-4 bg-gray-50 rounded-lg text-xs font-mono">
                                <summary className="cursor-pointer font-bold text-gray-700 mb-2">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="whitespace-pre-wrap text-gray-600">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReload}
                            className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <RefreshCw size={18} />
                            Reload App
                        </button>

                        <p className="text-xs text-neutral/40 text-center mt-4">
                            If this problem persists, contact support
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
