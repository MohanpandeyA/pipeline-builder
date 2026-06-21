import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
    console.log('[onConnect]', connection);
    set({ edges: addEdge(connection, get().edges) });
  },

  addNode: (node) =>
    set({ nodes: [...get().nodes, node] }),

  clearAll: () =>
    set({ nodes: [], edges: [] }),

  deleteSelected: () => {
    const selectedNodeIds = new Set(
      get().nodes.filter((n) => n.selected).map((n) => n.id)
    );
    set({
      nodes: get().nodes.filter((n) => !n.selected),
      edges: get().edges.filter(
        (e) => !e.selected && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target)
      ),
    });
  },

  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }),
}));

export { useStore };
