// Custom styled modal to replace the browser's native alert()

export function ResultModal({ result, onClose }) {
  if (!result) return null;

  const isDag = result.is_dag;
  const numNodes = result.num_nodes;
  const numEdges = result.num_edges;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.icon}>⚡</span>
          <span style={styles.title}>Pipeline Analysis</span>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {/* Nodes */}
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{numNodes !== undefined && numNodes !== null ? numNodes : '?'}</div>
            <div style={styles.statLabel}>NODES</div>
          </div>

          <div style={styles.vDivider} />

          {/* Edges */}
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{numEdges !== undefined && numEdges !== null ? numEdges : '?'}</div>
            <div style={styles.statLabel}>EDGES</div>
          </div>

          <div style={styles.vDivider} />

          {/* Is DAG */}
          <div style={styles.statBox}>
            <div style={{
              ...styles.statNumber,
              color: isDag ? '#22c55e' : '#f87171',
              fontSize: '22px',
            }}>
              {isDag ? '✓' : '✗'}
            </div>
            <div style={styles.statLabel}>IS DAG</div>
          </div>
        </div>

        {/* DAG explanation */}
        <div style={{
          ...styles.hint,
          background: isDag ? 'rgba(34,197,94,0.08)' : 'rgba(248,113,113,0.08)',
          borderColor: isDag ? 'rgba(34,197,94,0.25)' : 'rgba(248,113,113,0.25)',
          color: isDag ? '#86efac' : '#fca5a5',
        }}>
          {isDag
            ? '✓ Pipeline is valid — no circular dependencies.'
            : '✗ Pipeline has a cycle — remove the circular connection.'}
        </div>

        {/* Close button */}
        <button style={styles.btn} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#1a1f2e',
    border: '1px solid #2d3555',
    borderRadius: '16px',
    padding: '24px 28px',
    width: '360px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '20px',
  },
  title: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: '0.2px',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    background: '#0d1117',
    borderRadius: '12px',
    padding: '16px 12px',
    border: '1px solid #252d3d',
  },
  statBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#f1f5f9',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#475569',
    letterSpacing: '1px',
  },
  vDivider: {
    width: '1px',
    height: '40px',
    background: '#1e2a3a',
    flexShrink: 0,
  },
  hint: {
    fontSize: '12px',
    lineHeight: '1.5',
    textAlign: 'center',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid',
  },
  btn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '11px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    letterSpacing: '0.3px',
  },
};
