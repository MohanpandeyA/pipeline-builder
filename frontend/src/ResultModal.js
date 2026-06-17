// Custom styled modal to replace the browser's native alert()

export function ResultModal({ result, onClose }) {
  if (!result) return null;

  const isDag = result.is_dag;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.icon}>⚡</span>
          <span style={styles.title}>Pipeline Analysis</span>
        </div>

        {/* Stats */}
        <div style={styles.body}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Nodes</span>
            <span style={styles.statValue}>{result.num_nodes}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.stat}>
            <span style={styles.statLabel}>Edges</span>
            <span style={styles.statValue}>{result.num_edges}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.stat}>
            <span style={styles.statLabel}>Is DAG</span>
            <span style={{
              ...styles.statValue,
              color: isDag ? '#22c55e' : '#f87171',
              fontSize: '18px',
            }}>
              {isDag ? 'Yes ✓' : 'No ✗'}
            </span>
          </div>
        </div>

        {/* DAG explanation */}
        <p style={styles.hint}>
          {isDag
            ? 'Pipeline is valid — no circular dependencies detected.'
            : 'Pipeline has a cycle — data would loop infinitely. Remove the circular connection.'}
        </p>

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
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#1e2130',
    border: '1px solid #2d3148',
    borderRadius: '14px',
    padding: '28px 32px',
    width: '340px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '22px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: '0.3px',
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#0f1117',
    borderRadius: '10px',
    padding: '16px 20px',
    border: '1px solid #2d3148',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
  },
  statLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#e2e8f0',
  },
  divider: {
    width: '1px',
    background: '#2d3148',
    margin: '0 8px',
  },
  hint: {
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.5',
    textAlign: 'center',
    margin: '-8px 0',
  },
  btn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    letterSpacing: '0.3px',
  },
};
