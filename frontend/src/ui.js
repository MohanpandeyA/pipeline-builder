import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useStore } from './store';
import { InputNode }     from './nodes/inputNode';
import { OutputNode }    from './nodes/outputNode';
import { LLMNode }       from './nodes/llmNode';
import { TextNode }      from './nodes/textNode';
import { MathNode }      from './nodes/mathNode';
import { FilterNode }    from './nodes/filterNode';
import { ApiNode }       from './nodes/apiNode';
import { TransformNode } from './nodes/transformNode';
import { NoteNode }      from './nodes/noteNode';

// Register all node types — defined OUTSIDE component to avoid re-creation on render
const nodeTypes = {
  customInput:  InputNode,
  customOutput: OutputNode,
  llm:          LLMNode,
  text:         TextNode,
  math:         MathNode,
  filter:       FilterNode,
  api:          ApiNode,
  transform:    TransformNode,
  note:         NoteNode,
};

let nodeIdCounter = 1;
const getId = (type) => `${type}-${nodeIdCounter++}`;

// Inner component — must be inside ReactFlowProvider to use useReactFlow()
function FlowCanvas() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore();

  // Prevent self-connections (node connecting to itself)
  const isValidConnection = useCallback(
    (connection) => connection.source !== connection.target,
    []
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Convert screen coordinates to ReactFlow canvas coordinates
      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const id = getId(type);

      // Default sizes per node type
      const sizeMap = {
        customInput:  { width: 200, height: 130 },
        customOutput: { width: 200, height: 130 },
        llm:          { width: 200, height: 110 },
        text:         { width: 220, height: 140 },
        math:         { width: 200, height: 110 },
        filter:       { width: 200, height: 110 },
        api:          { width: 200, height: 110 },
        transform:    { width: 200, height: 110 },
        note:         { width: 240, height: 150 },
      };
      const size = sizeMap[type] || { width: 200, height: 120 };

      const newNode = {
        id,
        type,
        position,
        style: { width: size.width, height: size.height },
        data: { label: type },
      };

      addNode(newNode);
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        style={{ background: '#0f1117' }}
        isValidConnection={isValidConnection}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e2130"
        />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const colorMap = {
              customInput:  '#3b82f6',
              customOutput: '#22c55e',
              llm:          '#a855f7',
              text:         '#f59e0b',
              math:         '#ef4444',
              filter:       '#06b6d4',
              api:          '#f97316',
              transform:    '#14b8a6',
              note:         '#eab308',
            };
            return colorMap[n.type] || '#6366f1';
          }}
          nodeStrokeWidth={0}
          style={{
            background: '#1e2130',
            border: '1px solid #2d3148',
            borderRadius: '8px',
          }}
          maskColor="rgba(15,17,23,0.75)"
        />
      </ReactFlow>
    </div>
  );
}

// Wrap with ReactFlowProvider so useReactFlow() works inside FlowCanvas
export function PipelineUI() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
