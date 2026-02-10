import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-neutral/5">
                    <div className="max-w-md w-full glass rounded-[2rem] p-8 text-center space-y-6 border border-red-500/20 shadow-2xl">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                            <AlertCircle size={32} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-black text-accent tracking-tighter uppercase">Something skipped a beat</h1>
                            <p className="text-sm text-accent/50 leading-relaxed font-medium">
                                Even cats stumble sometimes. We've recorded the issue, but the app needs a quick refresh to get back in its groove.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
                        >
                            <RefreshCw size={20} />
                            Re-center App
                        </button>
                        <div className="pt-4 border-t border-neutral/5">
                            <p className="text-[10px] text-accent/20 uppercase tracking-[0.2em] font-black">Clinical Error Logged</p>
                            {this.state.error && (
                                <code className="block mt-2 text-[10px] text-red-400 bg-red-50/50 p-2 rounded-lg break-all italic">
                                    {this.state.error.message}
                                </code>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
