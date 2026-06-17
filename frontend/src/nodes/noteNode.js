import { useState } from 'react';
import { BaseNode, FieldLabel } from './BaseNode';

export function NoteNode({ id, data, selected }) {
  const [note, setNote] = useState(data?.note || '');

  return (
    <BaseNode
      title="📝 Note"
      headerColor="#eab308"
      inputs={[]}
      outputs={[]}
      width={240}
      selected={selected}
    >
      <div>
        <FieldLabel>Comment / Note</FieldLabel>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note or comment..."
          rows={4}
          style={{
            width: '100%',
            background: '#0f1117',
            border: '1px solid #2d3148',
            borderRadius: '5px',
            padding: '6px 8px',
            color: '#e2e8f0',
            fontSize: '12px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: '1.5',
          }}
        />
      </div>
    </BaseNode>
  );
}
