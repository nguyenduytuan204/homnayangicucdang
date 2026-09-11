import { Component, type ReactNode, type ErrorInfo } from 'react';

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

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0e1622',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'monospace',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍱</div>
          <h1 style={{ color: '#e5b358', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
            Ăn Gì Hôm Nay?
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', textAlign: 'center' }}>
            Có lỗi xảy ra. Thử xóa cache trình duyệt và tải lại trang nhé!
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              background: '#637d36',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            🔄 Tải lại trang
          </button>
          {this.state.error && (
            <details style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.75rem', maxWidth: '600px' }}>
              <summary>Chi tiết lỗi</summary>
              <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
