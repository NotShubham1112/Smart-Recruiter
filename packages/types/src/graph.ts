export interface CareerGraph {
  nodes: CareerGraphNode[];
  edges: CareerGraphEdge[];
  metadata: GraphMetadata;
}

export interface CareerGraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, unknown>;
}

export type NodeType =
  | 'candidate'
  | 'company'
  | 'role'
  | 'skill'
  | 'project'
  | 'technology'
  | 'achievement'
  | 'education'
  | 'industry';

export interface CareerGraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  properties: Record<string, unknown>;
  weight: number;
}

export type EdgeType =
  | 'worked_at'
  | 'built'
  | 'led'
  | 'contributed_to'
  | 'promoted_to'
  | 'collaborated_with'
  | 'uses'
  | 'achieved'
  | 'studied_at';

export interface GraphMetadata {
  nodeCount: number;
  edgeCount: number;
  density: number;
  centralNodes: string[];
}
