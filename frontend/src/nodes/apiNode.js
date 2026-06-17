import { useState } from 'react';
import { BaseNode, FieldLabel, FieldSelect } from './BaseNode';

const METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
];

export function ApiNode({ id, data, selected }) {
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode
      title="API Call"
      headerColor="#f97316"
      inputs={[
        { id: 'url', label: 'url' },
        { id: 'headers', label: 'headers' },
        { id: 'body', label: 'body' },
      ]}
      outputs={[
        { id: 'response', label: 'response' },
        { id: 'error', label: 'error' },
      ]}
      selected={selected}
    >
      <div>
        <FieldLabel>HTTP Method</FieldLabel>
        <FieldSelect value={method} onChange={(e) => setMethod(e.target.value)} options={METHODS} />
      </div>
    </BaseNode>
  );
}
