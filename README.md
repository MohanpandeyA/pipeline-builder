# ⚡ VectorShift Pipeline Builder

A visual, drag-and-drop pipeline editor built with **React + ReactFlow** (frontend) and **FastAPI** (backend) as part of the VectorShift Frontend Technical Assessment.

---

## Table of Contents

1. [What This App Does](#what-this-app-does)
2. [Tech Stack & Libraries](#tech-stack--libraries)
3. [Project Structure](#project-structure)
4. [Part 1 — Node Abstraction & Node Library](#part-1--node-abstraction--node-library)
5. [Part 2 — Unified Dark Theme](#part-2--unified-dark-theme)
6. [Part 3 — Smart Text Node](#part-3--smart-text-node)
7. [Part 4 — Backend Integration & DAG Analysis](#part-4--backend-integration--dag-analysis)
8. [Getting Started](#getting-started)
9. [How Data Flows (Architecture)](#how-data-flows-architecture)
10. [File-by-File Reference](#file-by-file-reference)

---

## What This App Does

The Pipeline Builder lets you:

- **Drag** node types from a sidebar onto a canvas
- **Connect** nodes by drawing edges between their handles (ports)
- **Configure** each node (e.g. type text, pick an operation)
- **Submit** the pipeline to a backend that tells you:
  - How many nodes and edges exist
  - Whether the pipeline is a **Directed Acyclic Graph (DAG)** — i.e. has no circular loops

---

## Tech Stack & Libraries

### Frontend

| Library | Version | What it does |
|---------|---------|--------------|
| **React** | 18.2 | UI component framework — builds the interface from reusable pieces |
| **ReactFlow** | 11.10 | The drag-and-drop canvas, node/edge rendering, and connection logic |
| **Zustand** | 4.4 | Lightweight global state manager — stores nodes and edges so any component can read/write them |
| **react-scripts** | 5.0 | Create React App toolchain — bundles and serves the frontend |

#### What is React?
React is a JavaScript library for building user interfaces. Instead of manually updating the HTML, you describe *what* the UI should look like and React figures out *how* to update it efficiently. Every button, node, and modal in this app is a React component.

#### What is ReactFlow?
ReactFlow is a library specifically built for node-based editors and diagrams. It handles:
- Rendering nodes as draggable boxes on a canvas
- Drawing animated edges (arrows) between nodes
- Zoom, pan, minimap, and controls
- Connection validation (e.g. preventing self-loops)

#### What is Zustand?
Zustand is a tiny state management library. Think of it as a **shared whiteboard** that every component can read from and write to — without having to pass data through props all the way down the component tree.

```
Without Zustand:  App → Canvas → Node → Handle → (needs edges data) → must pass as props ❌
With Zustand:     Any component → useStore() → gets edges directly ✓
```

### Backend

| Library | What it does |
|---------|--------------|
| **FastAPI** | Python web framework — creates the REST API endpoint |
| **Pydantic** | Data validation — ensures the JSON sent from the frontend matches the expected shape |
| **Uvicorn** | ASGI server — runs the FastAPI app |

#### What is FastAPI?
FastAPI is a modern Python web framework that automatically validates incoming JSON, generates API docs, and is very fast. When the frontend sends `POST /pipelines/parse`, FastAPI receives it, validates the body against the `Pipeline` Pydantic model, and calls the handler function.

#### What is Pydantic?
Pydantic lets you define data shapes as Python classes. If the frontend sends a node without an `id` field, Pydantic rejects it automatically with a clear error — no manual validation needed.

### Algorithm

| Algorithm | Used for |
|-----------|----------|
| **Kahn's Topological Sort** | Detecting whether the pipeline graph has cycles (DAG check) |

---

## Project Structure

```
vectorshift/
├── README.md
├── frontend/
│   ├── package.json              # npm dependencies
│   ├── .env.example              # environment variable template
│   └── src/
│       ├── index.js              # React entry point
│       ├── index.css             # Global dark theme CSS
│       ├── App.js                # Root layout, header, state wiring
│       ├── ui.js                 # ReactFlow canvas component
│       ├── toolbar.js            # Left sidebar node palette
│       ├── store.js              # Zustand global state (nodes + edges)
│       ├── submit.js             # Submit button + API call
│       ├── ResultModal.js        # Popup showing pipeline analysis results
│       └── nodes/
│           ├── BaseNode.js       # Shared node wrapper (all nodes extend this)
│           ├── inputNode.js      # Input node
│           ├── outputNode.js     # Output node
│           ├── llmNode.js        # LLM (AI model) node
│           ├── textNode.js       # Text node with {{variable}} handles
│           ├── mathNode.js       # Math operation node
│           ├── filterNode.js     # Filter/condition node
│           ├── apiNode.js        # API call node
│           ├── transformNode.js  # Data transform node
│           └── noteNode.js       # Sticky note node
└── backend/
    ├── main.py                   # FastAPI app + DAG check algorithm
    └── requirements.txt          # Python dependencies
```

---

## Part 1 — Node Abstraction & Node Library

### The Problem
Without abstraction, every node type would duplicate the same boilerplate: dark background, rounded corners, title bar, handle styling, resize logic. That's 9× repeated code.

### The Solution — `BaseNode.js`

[`BaseNode`](frontend/src/nodes/BaseNode.js) is a shared wrapper component that every node type uses. It provides:

- Consistent dark card styling with a colored accent border
- A title bar with an icon and label
- `NodeResizer` so every node can be dragged to resize
- `Handle` components for input/output ports

Every specific node just calls `<BaseNode>` and passes its own fields:

```jsx
// Example: inputNode.js
export function InputNode({ id, data }) {
  return (
    <BaseNode id={id} data={data} title="Input" color="#3b82f6" outputs={['value']}>
      <FieldLabel>Name</FieldLabel>
      <FieldInput ... />
    </BaseNode>
  );
}
```

### The 9 Node Types

| Node | Color | Purpose |
|------|-------|---------|
| **Input** | Blue | Entry point — provides data into the pipeline |
| **Output** | Green | Exit point — receives final pipeline result |
| **LLM** | Purple | Represents an AI language model call |
| **Text** | Amber | Static or dynamic text with `{{variable}}` handles |
| **Math** | Red | Arithmetic operations (add, subtract, multiply, divide) |
| **Filter** | Cyan | Conditional filtering of data |
| **API Call** | Orange | Makes an external HTTP request |
| **Transform** | Teal | Transforms/maps data from one format to another |
| **Note** | Yellow | Non-functional sticky note for documentation |

---

## Part 2 — Unified Dark Theme

The entire app uses a consistent dark color palette:

| Color | Hex | Used for |
|-------|-----|----------|
| Canvas background | `#0f1117` | Main canvas |
| Header/sidebar | `#111827` | Top bar and toolbar |
| Node cards | `#1a1f2e` | Node backgrounds |
| Borders | `#2d3148` | Card and panel borders |
| Primary text | `#e2e8f0` | Headings and labels |
| Muted text | `#6b7280` | Secondary labels |
| Accent (submit) | `#6366f1 → #8b5cf6` | Gradient on submit button |

ReactFlow's default light styles are overridden in [`index.css`](frontend/src/index.css) to match the dark theme — including the controls panel, minimap, and edge colors.

---

## Part 3 — Smart Text Node

The Text node ([`textNode.js`](frontend/src/nodes/textNode.js)) has a special feature: **dynamic input handles from template variables**.

### How it works

1. User types `{{variableName}}` anywhere in the textarea
2. The node parses the text with a regex: `/\{\{(\w+)\}\}/g`
3. For each unique variable found, a new **input Handle** appears on the left side of the node
4. If the variable is removed from the text, the handle disappears

```
Text content: "Hello {{name}}, your score is {{score}}"
                        ↓                      ↓
              Handle: "name"          Handle: "score"
```

This allows the Text node to receive dynamic values from other nodes in the pipeline, making it a template engine.

### Auto-resize
The textarea grows vertically as you type — no scrollbars, no clipping. This is done by setting `height: auto` and reading `scrollHeight` on every keystroke.

---

## Part 4 — Backend Integration & DAG Analysis

This is the full-stack integration that connects the visual canvas to the Python backend.

### Overview of the flow

```
User clicks "Submit Pipeline"
        │
        ▼
submit.js reads nodes + edges from Zustand store
        │
        ▼
POST /pipelines/parse  →  FastAPI (main.py)
  body: { nodes: [...], edges: [...] }
        │
        ▼
Backend counts nodes and edges
Backend runs Kahn's Algorithm to check for cycles
        │
        ▼
Response: { num_nodes: 3, num_edges: 2, is_dag: true }
        │
        ▼
ResultModal pops up showing the analysis
```

---

### Frontend — `submit.js`

```javascript
const handleSubmit = async () => {
  const res = await fetch(`${API}/pipelines/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges }),  // from Zustand store
  });
  const data = await res.json();
  onResult(data);  // passes result to App.js → ResultModal
};
```

- `nodes` and `edges` come from the Zustand store — they represent everything on the canvas
- `onResult` is a callback from `App.js` that sets `modalResult` state, triggering the modal

---

### Backend — `main.py`

#### Pydantic models (data validation)

```python
class Node(BaseModel):
    id: str
    type: str = ""
    data: Dict[str, Any] = {}
    position: Dict[str, float] = {}

class Edge(BaseModel):
    id: str
    source: str   # ID of the node this edge starts from
    target: str   # ID of the node this edge points to

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
```

#### The endpoint

```python
@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag    = check_is_dag(pipeline.nodes, pipeline.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": is_dag}
```

#### DAG Check — Kahn's Algorithm

A **DAG (Directed Acyclic Graph)** is a graph with directed edges and **no cycles**. Pipelines must be DAGs — if node A feeds into node B which feeds back into node A, the pipeline would loop forever.

**Kahn's Algorithm** detects cycles using topological sort:

```python
def check_is_dag(nodes, edges) -> bool:
    # 1. Count how many edges point INTO each node (in-degree)
    in_degree = {n.id: 0 for n in nodes}
    adj = defaultdict(list)
    for edge in edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    # 2. Start with nodes that have NO incoming edges
    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
    visited = 0

    # 3. Process each node: remove it and reduce in-degree of its neighbors
    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # 4. If ALL nodes were visited → no cycle → it's a DAG
    return visited == len(nodes)
```

**Why does this work?**
- If there's a cycle (A→B→C→A), none of those nodes will ever reach in-degree 0, so they'll never enter the queue
- The `visited` count will be less than `len(nodes)` → cycle detected → `is_dag = False`

---

### Frontend — `ResultModal.js`

Instead of a plain browser `alert()`, a styled modal displays the results:

```
┌──────────────────────────────────┐
│  ⚡ Pipeline Analysis             │
│                                  │
│  ┌────────┬────────┬──────────┐  │
│  │   3    │   2    │    ✓     │  │
│  │ NODES  │ EDGES  │  IS DAG  │  │
│  └────────┴────────┴──────────┘  │
│                                  │
│  ✓ Pipeline is valid —           │
│    no circular dependencies.     │
│                                  │
│           [  OK  ]               │
└──────────────────────────────────┘
```

- `is_dag: true` → green ✓ + "Pipeline is valid" message
- `is_dag: false` → red ✗ + "Pipeline has a cycle — remove the circular connection"

---

### State — `store.js` (Zustand)

The Zustand store is the **single source of truth** for all canvas data:

```javascript
const useStore = create((set, get) => ({
  nodes: [],          // all nodes on the canvas
  edges: [],          // all connections between nodes

  // Called by ReactFlow when nodes are moved/selected/deleted
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),

  // Called by ReactFlow when edges change
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  // Called when user draws a new connection between two handles
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),

  // Called when a node is dropped from the toolbar onto the canvas
  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  // Utility actions
  clearAll: () => set({ nodes: [], edges: [] }),
  deleteSelected: () => { /* removes selected nodes and their connected edges */ },
  updateNodeData: (id, data) => { /* updates a single node's data */ },
}));
```

Any component reads from the store with a **selector**:
```javascript
const nodes = useStore((s) => s.nodes);  // only re-renders when nodes change
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **Python** 3.9 or higher

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd vectorshift
```

### 2. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API available at: http://localhost:8000
# Auto-docs at:     http://localhost:8000/docs
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm start
# App available at: http://localhost:3000
```

### 4. Environment Variables (optional)

Copy `frontend/.env.example` to `frontend/.env` and set:
```
REACT_APP_API_URL=http://localhost:8000
```

If not set, the frontend defaults to `http://localhost:8000`.

---

## How Data Flows (Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                        FRONTEND                         │
│                                                         │
│  toolbar.js          ui.js (ReactFlow canvas)           │
│  ┌──────────┐        ┌──────────────────────────┐       │
│  │ Node     │ drag   │  Nodes rendered as cards  │       │
│  │ Palette  │──────▶ │  Edges as arrows          │       │
│  └──────────┘  drop  │  Zoom / Pan / MiniMap     │       │
│                       └────────────┬─────────────┘       │
│                                    │ read/write           │
│                                    ▼                      │
│                       ┌────────────────────────┐         │
│                       │   store.js (Zustand)   │         │
│                       │   nodes: [...]          │         │
│                       │   edges: [...]          │         │
│                       └────────────┬───────────┘         │
│                                    │ read                 │
│                                    ▼                      │
│                       ┌────────────────────────┐         │
│                       │   submit.js            │         │
│                       │   POST /pipelines/parse │         │
│                       └────────────┬───────────┘         │
└────────────────────────────────────│────────────────────┘
                                     │ HTTP POST
                                     ▼
┌─────────────────────────────────────────────────────────┐
│                        BACKEND                          │
│                                                         │
│   main.py (FastAPI)                                     │
│   ┌─────────────────────────────────────────────────┐   │
│   │  POST /pipelines/parse                          │   │
│   │  1. Validate body with Pydantic                 │   │
│   │  2. num_nodes = len(nodes)                      │   │
│   │  3. num_edges = len(edges)                      │   │
│   │  4. is_dag = check_is_dag() [Kahn's algorithm]  │   │
│   │  5. return { num_nodes, num_edges, is_dag }     │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                                     │ JSON response
                                     ▼
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (cont.)                    │
│                                                         │
│   ResultModal.js                                        │
│   Shows: num_nodes | num_edges | is_dag (✓/✗)          │
└─────────────────────────────────────────────────────────┘
```

---

## File-by-File Reference

| File | Role | Key exports |
|------|------|-------------|
| [`src/index.js`](frontend/src/index.js) | React entry point — mounts `<App>` into the DOM | — |
| [`src/index.css`](frontend/src/index.css) | Global dark theme, ReactFlow overrides | — |
| [`src/App.js`](frontend/src/App.js) | Root layout: header, toolbar, canvas, modal wiring | `default App` |
| [`src/ui.js`](frontend/src/ui.js) | ReactFlow canvas with drag-drop, node types, minimap | `PipelineUI` |
| [`src/toolbar.js`](frontend/src/toolbar.js) | Left sidebar with draggable node type cards | `PipelineToolbar` |
| [`src/store.js`](frontend/src/store.js) | Zustand store — nodes, edges, and all mutation actions | `useStore` |
| [`src/submit.js`](frontend/src/submit.js) | Submit button — POSTs pipeline to backend | `SubmitButton` |
| [`src/ResultModal.js`](frontend/src/ResultModal.js) | Styled modal showing pipeline analysis results | `ResultModal` |
| [`src/nodes/BaseNode.js`](frontend/src/nodes/BaseNode.js) | Shared node wrapper with styling, handles, resizer | `BaseNode` |
| [`src/nodes/inputNode.js`](frontend/src/nodes/inputNode.js) | Input node (blue) | `InputNode` |
| [`src/nodes/outputNode.js`](frontend/src/nodes/outputNode.js) | Output node (green) | `OutputNode` |
| [`src/nodes/llmNode.js`](frontend/src/nodes/llmNode.js) | LLM node (purple) | `LLMNode` |
| [`src/nodes/textNode.js`](frontend/src/nodes/textNode.js) | Text node with `{{variable}}` dynamic handles (amber) | `TextNode` |
| [`src/nodes/mathNode.js`](frontend/src/nodes/mathNode.js) | Math operation node (red) | `MathNode` |
| [`src/nodes/filterNode.js`](frontend/src/nodes/filterNode.js) | Filter/condition node (cyan) | `FilterNode` |
| [`src/nodes/apiNode.js`](frontend/src/nodes/apiNode.js) | API call node (orange) | `ApiNode` |
| [`src/nodes/transformNode.js`](frontend/src/nodes/transformNode.js) | Data transform node (teal) | `TransformNode` |
| [`src/nodes/noteNode.js`](frontend/src/nodes/noteNode.js) | Sticky note node (yellow) | `NoteNode` |
| [`backend/main.py`](backend/main.py) | FastAPI app, Pydantic models, DAG check endpoint | `app` |
| [`backend/requirements.txt`](backend/requirements.txt) | Python dependencies | — |

---

## Tech Stack Summary

```
Frontend                    Backend
────────────────────        ────────────────────
React 18                    Python 3.9+
ReactFlow 11                FastAPI
Zustand 4                   Pydantic
react-scripts (CRA)         Uvicorn

Algorithm: Kahn's Topological Sort (DAG cycle detection)
Styling:   Inline styles + CSS overrides (no CSS framework)
```
