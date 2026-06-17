import { useState } from 'react';
import { BaseNode, FieldLabel, FieldInput, FieldSelect } from './BaseNode';

const TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'file', label: 'File' },
  { value: 'image', label: 'Image' },
];

export function OutputNode({ id, data, selected }) {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType] = useState(data?.outputType || 'text');

  return (
    <BaseNode
      title="Output"
      headerColor="#22c55e"
      inputs={[{ id: 'value', label: 'value' }]}
      outputs={[]}
      selected={selected}
    >
      <div>
        <FieldLabel>Name</FieldLabel>
        <FieldInput value={name} onChange={(e) => setName(e.target.value)} placeholder="output_name" />
      </div>
      <div>
        <FieldLabel>Type</FieldLabel>
        <FieldSelect value={type} onChange={(e) => setType(e.target.value)} options={TYPE_OPTIONS} />
      </div>
    </BaseNode>
  );
}
