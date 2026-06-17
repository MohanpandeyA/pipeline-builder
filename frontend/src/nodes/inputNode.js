import { useState } from 'react';
import { BaseNode, FieldLabel, FieldInput, FieldSelect } from './BaseNode';

const TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'file', label: 'File' },
  { value: 'number', label: 'Number' },
];

export function InputNode({ id, data, selected }) {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [type, setType] = useState(data?.inputType || 'text');

  return (
    <BaseNode
      title="Input"
      headerColor="#3b82f6"
      inputs={[]}
      outputs={[{ id: 'value', label: 'value' }]}
      selected={selected}
    >
      <div>
        <FieldLabel>Name</FieldLabel>
        <FieldInput value={name} onChange={(e) => setName(e.target.value)} placeholder="input_name" />
      </div>
      <div>
        <FieldLabel>Type</FieldLabel>
        <FieldSelect value={type} onChange={(e) => setType(e.target.value)} options={TYPE_OPTIONS} />
      </div>
    </BaseNode>
  );
}
