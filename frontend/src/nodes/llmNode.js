import { BaseNode } from './BaseNode';

export function LLMNode({ id, data, selected }) {
  return (
    <BaseNode
      title="LLM"
      headerColor="#a855f7"
      inputs={[
        { id: 'system', label: 'system' },
        { id: 'prompt', label: 'prompt' },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
      selected={selected}
    >
      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
        Large Language Model node. Connect a system prompt and user prompt to generate a response.
      </p>
    </BaseNode>
  );
}
