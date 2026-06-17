import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';
import { ResultModal }     from './ResultModal';
import { useStore }        from './store';

function App() {
  const [modalResult, setModalResult] = useState(null);
  const clearAll       = useStore((s) => s.clearAll);
  const deleteSelected = useStore((s) => s.deleteSelected);
  const nodes          = useStore((s) => s.nodes);
  const edges          = useStore((s) => s.edges);
  const hasSelection   = nodes.some((n) => n.selected) || edges.some((e) => e.selected);

  return (
    <div style={styles.app}>
      {/* Top header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>⚡</span>
          <span style={styles.title}>Pipeline Builder</span>
          {nodes.length > 0 && (
            <div style={styles.stats}>
              <span style={styles.statBadge}>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
              <span style={styles.statBadge}>{edges.length} edge{edges.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div style={styles.headerRight}>
          {hasSelection && (
            <button onClick={deleteSelected} style={styles.deleteBtn}>
              ✕ Delete
            </button>
          )}
          <button onClick={clearAll} style={styles.clearBtn} disabled={nodes.length === 0}>
            🗑 Clear
          </button>
          <SubmitButton onResult={setModalResult} />
        </div>
      </header>

      {/* Main layout */}
      <div style={styles.main}>
        <PipelineToolbar />
        <PipelineUI />
      </div>

      {/* Result modal */}
      <ResultModal result={modalResult} onClose={() => setModalResult(null)} />
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#0f1117',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '48px',
    background: '#111827',
    borderBottom: '1px solid #1f2937',
    flexShrink: 0,
    zIndex: 20,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '18px',
  },
  title: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#e2e8f0',
    letterSpacing: '0.2px',
  },
  stats: {
    display: 'flex',
    gap: '6px',
    marginLeft: '4px',
  },
  statBadge: {
    background: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '20px',
    padding: '2px 8px',
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: '500',
  },
  headerRight: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.12)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  clearBtn: {
    background: 'transparent',
    color: '#6b7280',
    border: '1px solid #374151',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
};

export default App;
