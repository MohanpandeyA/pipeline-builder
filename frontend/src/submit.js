import { useStore } from './store';

export function SubmitButton({ onResult }) {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const handleSubmit = async () => {
    try {
      const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      console.log('[Pipeline API response]', data);
      onResult(data);
    } catch (err) {
      onResult({ error: err.message });
    }
  };

  return (
    <button onClick={handleSubmit} style={btnStyle}>
      ▶ Submit Pipeline
    </button>
  );
}

const btnStyle = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  letterSpacing: '0.3px',
  boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
};
