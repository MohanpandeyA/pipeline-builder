// Draggable node palette — left sidebar

const NODE_TYPES = [
  { type: 'customInput',  label: 'Input',     color: '#3b82f6', icon: '→' },
  { type: 'customOutput', label: 'Output',    color: '#22c55e', icon: '←' },
  { type: 'llm',          label: 'LLM',       color: '#a855f7', icon: '🤖' },
  { type: 'text',         label: 'Text',      color: '#f59e0b', icon: 'T' },
  { type: 'math',         label: 'Math',      color: '#ef4444', icon: '±' },
  { type: 'filter',       label: 'Filter',    color: '#06b6d4', icon: '⊿' },
  { type: 'api',          label: 'API Call',  color: '#f97316', icon: '⇌' },
  { type: 'transform',    label: 'Transform', color: '#14b8a6', icon: '⟳' },
  { type: 'note',         label: 'Note',      color: '#eab308', icon: '✎' },
];

export function PipelineToolbar() {
  const onDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <span style={styles.brandIcon}>⚡</span>
        <span style={styles.brandName}>VectorShift</span>
      </div>

      {/* Section label */}
      <p style={styles.sectionLabel}>NODES</p>

      {/* Node chips */}
      <div style={styles.chipList}>
        {NODE_TYPES.map(({ type, label, color, icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            style={styles.chip}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#252d45';
              e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1a2035';
              e.currentTarget.style.borderColor = '#2d3148';
            }}
          >
            <span style={{ ...styles.chipIcon, background: color + '22', color }}>
              {icon}
            </span>
            <span style={styles.chipLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div style={styles.footer}>
        <span style={styles.hint}>↕ Drag to canvas</span>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '160px',
    minWidth: '160px',
    background: '#111827',
    borderRight: '1px solid #1f2937',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 12px 10px',
    borderBottom: '1px solid #1f2937',
  },
  brandIcon: {
    fontSize: '16px',
  },
  brandName: {
    fontWeight: '700',
    fontSize: '13px',
    color: '#e2e8f0',
    letterSpacing: '0.2px',
  },
  sectionLabel: {
    fontSize: '9px',
    color: '#374151',
    fontWeight: '700',
    letterSpacing: '1.2px',
    padding: '10px 12px 4px',
  },
  chipList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '4px 8px',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 8px',
    cursor: 'grab',
    borderRadius: '7px',
    border: '1px solid #2d3148',
    background: '#1a2035',
    transition: 'background 0.15s, border-color 0.15s',
    userSelect: 'none',
  },
  chipIcon: {
    width: '22px',
    height: '22px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0,
  },
  chipLabel: {
    fontSize: '12px',
    color: '#cbd5e1',
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    padding: '10px 12px',
    borderTop: '1px solid #1f2937',
  },
  hint: {
    fontSize: '10px',
    color: '#374151',
  },
};
