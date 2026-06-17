from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any, Dict
from collections import defaultdict, deque

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ──────────────────────────────────────────────────────────

class Node(BaseModel):
    id: str
    type: str = ""
    data: Dict[str, Any] = {}
    position: Dict[str, float] = {}

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = ""
    targetHandle: str = ""

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


# ── DAG check via Kahn's algorithm (topological sort) ────────────────────────

def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    node_ids = {n.id for n in nodes}

    # Only consider edges between known nodes
    valid_edges = [e for e in edges if e.source in node_ids and e.target in node_ids]

    in_degree: Dict[str, int] = {n.id: 0 for n in nodes}
    adj: Dict[str, List[str]] = defaultdict(list)

    for edge in valid_edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    # Start with all nodes that have no incoming edges
    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we visited all nodes, there are no cycles → it's a DAG
    return visited == len(nodes)


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "VectorShift Pipeline API"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag    = check_is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag":    is_dag,
    }
