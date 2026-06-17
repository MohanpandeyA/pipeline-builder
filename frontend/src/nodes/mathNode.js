import { useState } from 'react';
import { BaseNode, FieldLabel, FieldSelect } from './BaseNode';

const OPS = [
  { value: 'add',      label: 'Add (+)' },
  { value: 'subtract', label: 'Subtract (-)' },
  { value: 'multiply', label: 'Multiply (×)' },
  { value: 'divide',   label: 'Divide (÷)' },
];

export function MathNode({ id, data, selected }) {
  const [op, setOp] = useState(data?.operation || 'add');

  return (
    <BaseNode
      title="Math"
      headerColor="#ef4444"
      inputs={[
        { id: 'a', label: 'a' },
        { id: 'b', label: 'b' },
      ]}
      outputs={[{ id: 'result', label: 'result' }]}
      selected={selected}
    >
      <div>
        <FieldLabel>Operation</FieldLabel>
        <FieldSelect value={op} onChange={(e) => setOp(e.target.value)} options={OPS} />
      </div>
    </BaseNode>
  );
}
