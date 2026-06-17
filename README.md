# VectorShift Pipeline Builder

A visual pipeline editor built with **React + ReactFlow** (frontend) and **FastAPI** (backend) as part of the VectorShift Frontend Technical Assessment.

## Features

### Part 1 — Node Abstraction & Node Library
- `BaseNode` shared abstraction component used by all nodes
- Reusable field helpers: `FieldLabel`, `FieldInput`, `FieldSelect`
- **9 node types**: Input, Output, LLM, Text, Math, Filter, API Call, Transform, Note

### Part 2 — Unified Dark Theme
- Full dark UI with per-node accent colors
- Custom ReactFlow overrides (controls, minimap, handles)

### Part 3 — Smart Text Node
- Type `{{variable}}` to automatically create a new input Handle
- Textarea auto-resizes as you type
- Multiple unique variables supported simultaneously

### Part 4 — Pipeline Submit & DAG Analysis
- Submit button POSTs `{ nodes, edges }` to `/pipelines/parse`
- Backend runs **Kahn's topological sort** to detect cycles
- Custom result modal shows `num_nodes`, `num_edges`, `is_dag` (✓/✗)

### Extras
- Drag-to-resize every node (corners + edges) via `NodeResizer`
- **Delete Selected** and **Clear All** canvas controls
- Live node/edge count badges in header
- Accurate drag-drop positioning via `screenToFlowPosition()`

---

## Getting Started

### Prerequisites
- Node.js v18+
- Python 3.9+

### Frontend
```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

---

## Project Structure

```
vectorshift/
├── frontend/
│   └── src/
│       ├── nodes/
│       │   ├── BaseNode.js       # Shared node abstraction
│       │   ├── inputNode.js
│       │   ├── outputNode.js
│       │   ├── llmNode.js
│       │   ├── textNode.js       # {{variable}} dynamic handles
│       │   ├── mathNode.js
│       │   ├── filterNode.js
│       │   ├── apiNode.js
│       │   ├── transformNode.js
│       │   └── noteNode.js
│       ├── App.js                # Root layout + header
│       ├── ui.js                 # ReactFlow canvas
│       ├── toolbar.js            # Node palette sidebar
│       ├── store.js              # Zustand state
│       ├── submit.js             # API submit
│       ├── ResultModal.js        # Result popup
│       └── index.css             # Global dark theme
└── backend/
    ├── main.py                   # FastAPI + DAG check
    └── requirements.txt
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, ReactFlow v11, Zustand |
| Backend | FastAPI, Pydantic, Uvicorn |
| Algorithm | Kahn's topological sort (DAG detection) |
| Styling | Inline styles + CSS overrides (dark theme) |
