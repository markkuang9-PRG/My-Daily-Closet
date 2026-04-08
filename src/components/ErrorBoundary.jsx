import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { logAppError } from '../lib/logger';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    logAppError(error, {
      operation: 'render_error_boundary',
      path: window.location.pathname,
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-900">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            The app ran into an unexpected error. You can reload and try again.
          </p>
          {this.state.error?.message ? (
            <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-left text-xs text-gray-500">
              {this.state.error.message}
            </p>
          ) : null}
          <button
            onClick={this.handleReset}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <RefreshCcw className="h-4 w-4" />
            Reload app
          </button>
        </div>
      </div>
    );
  }
}
