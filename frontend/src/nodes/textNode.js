import { useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeResizer, useReactFlow, useUpdateNodeInternals } from 'reactflow';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export function TextNode({ id, data, selected }) {
  const [text, setText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const extractVariables = useCallback((val) => {
    const matches = [...val.matchAll(VAR_REGEX)];
    const unique = [...new Set(matches.map((m) => m[1]))];
    setVariables(unique);
  }, []);

  // Auto-resize: grow the ReactFlow node height to fit content
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Reset textarea height to measure true scrollHeight
    el.style.height = 'auto';
    const newTextareaHeight = Math.max(60, el.scrollHeight);
    el.style.height = `${newTextareaHeight}px`;

    // Header ~28px + label ~18px + padding ~24px + textarea
    const newNodeHeight = newTextareaHeight + 70;

    // Update the ReactFlow node's style.height so the card grows
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, style: { ...n.style, height: newNodeHeight } }
          : n
      )
    );
  }, [id, setNodes]);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    extractVariables(val);
  };

  useEffect(() => {
    autoResize();
  }, [text, autoResize]);

  useEffect(() => {
    extractVariables(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tell ReactFlow to re-register handles whenever variables change
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  return (
    // Outer wrapper: overflow visible so handles aren't clipped
    <div style={styles.wrapper}>
      <NodeResizer
        isVisible={selected}
        minWidth={180}
        minHeight={90}
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

      {/* Dynamic variable handles — left side */}
      {variables.map((varName, i) => {
        const topPct = variables.length === 1
          ? '50%'
          : `${((i + 1) / (variables.length + 1)) * 100}%`;
        return (
          <Handle
            key={varName}
            type="target"
            position={Position.Left}
            id={`var-${varName}`}
            style={{ top: topPct }}
          />
        );
      })}

      {/* Output handle — right side */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ top: '50%' }}
      />

      {/* Inner card — height: 100% fills the ReactFlow node which we update above */}
      <div style={{ ...styles.card, borderColor: selected ? '#6366f1' : '#252f47' }}>
        {/* Header */}
        <div style={styles.header}>
          <span>Text</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {variables.map((v) => (
              <span key={v} style={styles.varTag}>{v}</span>
            ))}
            <span style={styles.portLabel}>output</span>
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <label style={styles.label}>
            Use {'{{variable}}'} to add input handles
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            placeholder={'Enter text...\nUse {{variable}} to create inputs'}
            style={styles.textarea}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  card: {
    background: '#161d2e',
    border: '1.5px solid #252f47',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'border-color 0.15s',
  },
  header: {
    background: '#f59e0b',
    borderRadius: '6px 6px 0 0',
    padding: '5px 10px',
    fontWeight: '600',
    fontSize: '11px',
    color: '#fff',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  varTag: {
    fontSize: '9px',
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '3px',
    padding: '1px 4px',
  },
  portLabel: {
    fontSize: '9px',
    color: 'rgba(255,255,255,0.6)',
  },
  body: {
    padding: '7px 10px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  label: {
    fontSize: '9px',
    color: '#4b6080',
    fontWeight: '500',
    display: 'block',
    flexShrink: 0,
  },
  textarea: {
    width: '100%',
    background: '#0d1117',
    border: '1px solid #1f2937',
    borderRadius: '4px',
    padding: '5px 7px',
    color: '#cbd5e1',
    fontSize: '11px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    minHeight: '50px',
    overflow: 'hidden',  // hide scrollbar — node grows instead
  },
};
