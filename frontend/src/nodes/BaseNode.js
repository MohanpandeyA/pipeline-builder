import { Handle, Position, NodeResizer } from 'reactflow';

/**
 * BaseNode — shared abstraction for all pipeline nodes.
 */
export function BaseNode({
  title,
  headerColor = '#6366f1',
  inputs = [],
  outputs = [],
  children,
  selected,
}) {
  return (
    // Outer wrapper: overflow visible so handles aren't clipped
    <div style={styles.wrapper}>
      {/* ── Professional resize handles ── */}
      <NodeResizer
        isVisible={selected}
        minWidth={160}
        minHeight={80}
        keepAspectRatio={false}
        lineStyle={{ borderColor: '#6366f1', borderWidth: 1.5 }}
        handleStyle={{
          width: 9,
          height: 9,
          borderRadius: 2,
          background: '#fff',
          border: '2px solid #6366f1',
        }}
      />

      {/* ── Input handles (left side) ── */}
      {inputs.map((inp, i) => {
        const topPct = inputs.length === 1
          ? '50%'
          : `${((i + 1) / (inputs.length + 1)) * 100}%`;
        return (
          <Handle
            key={inp.id}
            type="target"
            position={Position.Left}
            id={inp.id}
            style={{ top: topPct, ...(inp.style || {}) }}
          />
        );
      })}

      {/* ── Output handles (right side) ── */}
      {outputs.map((out, i) => {
        const topPct = outputs.length === 1
          ? '50%'
          : `${((i + 1) / (outputs.length + 1)) * 100}%`;
        return (
          <Handle
            key={out.id}
            type="source"
            position={Position.Right}
            id={out.id}
            style={{ top: topPct, ...(out.style || {}) }}
          />
        );
      })}

      {/* ── Inner card (clipped, no overflow) ── */}
      <div style={{ ...styles.card, borderColor: selected ? '#6366f1' : '#252f47' }}>
        {/* Header */}
        <div style={{ ...styles.header, background: headerColor }}>
          <span>{title}</span>
          {/* Handle port labels */}
          <div style={styles.portLabels}>
            <div style={styles.portLeft}>
              {inputs.map((inp) => (
                <span key={inp.id} style={styles.portLabel}>{inp.label}</span>
              ))}
            </div>
            <div style={styles.portRight}>
              {outputs.map((out) => (
                <span key={out.id} style={styles.portLabel}>{out.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    // overflow visible so handles stick out past the card edge
  },
  card: {
    background: '#161d2e',
    border: '1.5px solid #252f47',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '11px',
    color: '#e2e8f0',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'border-color 0.15s',
  },
  header: {
    borderRadius: '6px 6px 0 0',
    padding: '5px 10px',
    fontWeight: '600',
    fontSize: '11px',
    color: '#fff',
    letterSpacing: '0.3px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  portLabels: {
    display: 'flex',
    gap: '8px',
  },
  portLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1px',
  },
  portRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '1px',
  },
  portLabel: {
    fontSize: '9px',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '400',
  },
  body: {
    padding: '8px 10px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    // NO overflow: auto — prevents scrollbar
  },
};

/* ── Shared field helpers ── */

export function FieldLabel({ children }) {
  return (
    <label style={{
      fontSize: '10px',
      color: '#4b6080',
      fontWeight: '500',
      display: 'block',
      marginBottom: '2px',
    }}>
      {children}
    </label>
  );
}

export function FieldInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: '#0d1117',
        border: '1px solid #1f2937',
        borderRadius: '4px',
        padding: '4px 7px',
        color: '#cbd5e1',
        fontSize: '11px',
        outline: 'none',
        fontFamily: 'inherit',
      }}
    />
  );
}

export function FieldSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        background: '#0d1117',
        border: '1px solid #1f2937',
        borderRadius: '4px',
        padding: '4px 7px',
        color: '#cbd5e1',
        fontSize: '11px',
        outline: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
