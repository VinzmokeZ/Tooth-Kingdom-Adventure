import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-3xl border-2 border-gray-200 m-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500 animate-pulse">
                        <AlertTriangle className="w-10 h-10" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Oops! Something went wrong
                    </h2>

                    <p className="text-gray-600 mb-8 max-w-md">
                        We encountered an unexpected error in this adventure. Don't worry, your progress has been saved!
                    </p>

                    {this.state.error && (
                        <div className="mb-8 p-4 bg-red-50 text-red-800 text-sm rounded-xl max-w-lg overflow-auto border border-red-100 text-left w-full">
                            <p className="font-bold mb-1">Error details:</p>
                            <code className="block whitespace-pre-wrap font-mono text-xs">
                                {this.state.error.message}
                            </code>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={this.handleReset}
                            className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Return Home
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 hover:shadow-lg transition-all flex items-center gap-2 shadow-md"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Reload Game
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
