import { useState } from 'react';
import { BaseNode, FieldLabel, FieldSelect } from './BaseNode';

const TRANSFORMS = [
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'trim', label: 'Trim Whitespace' },
  { value: 'json_parse', label: 'JSON Parse' },
  { value: 'json_stringify', label: 'JSON Stringify' },
  { value: 'base64_encode', label: 'Base64 Encode' },
  { value: 'base64_decode', label: 'Base64 Decode' },
];

export function TransformNode({ id, data, selected }) {
  const [transform, setTransform] = useState(data?.transform || 'uppercase');

  return (
    <BaseNode
      title="Transform"
      headerColor="#14b8a6"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
      selected={selected}
    >
      <div>
        <FieldLabel>Transform Type</FieldLabel>
        <FieldSelect value={transform} onChange={(e) => setTransform(e.target.value)} options={TRANSFORMS} />
      </div>
    </BaseNode>
  );
}
