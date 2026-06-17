import { useState } from 'react';
import { BaseNode, FieldLabel, FieldSelect } from './BaseNode';

const CONDITIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'not_empty', label: 'Not Empty' },
];

export function FilterNode({ id, data, selected }) {
  const [condition, setCondition] = useState(data?.condition || 'equals');

  return (
    <BaseNode
      title="Filter"
      headerColor="#06b6d4"
      inputs={[
        { id: 'data', label: 'data' },
        { id: 'condition', label: 'condition' },
      ]}
      outputs={[
        { id: 'filtered', label: 'filtered' },
        { id: 'rejected', label: 'rejected' },
      ]}
      selected={selected}
    >
      <div>
        <FieldLabel>Condition Type</FieldLabel>
        <FieldSelect value={condition} onChange={(e) => setCondition(e.target.value)} options={CONDITIONS} />
      </div>
    </BaseNode>
  );
}
