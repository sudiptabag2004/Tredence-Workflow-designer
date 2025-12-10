// This file defines the structure of our data

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

// Base node data that all nodes share
export interface BaseNodeData {
  label: string;
  type: NodeType;
}

// Specific data for each node type
export interface StartNodeData extends BaseNodeData {
  type: 'start';
  title: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  title: string;
  approverRole?: string;
  autoApproveThreshold?: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  type: 'automated';
  title: string;
  actionId?: string;
  actionParams?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage?: string;
  showSummary?: boolean;
}

// Union type - a node can be any of these types
export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedStepNodeData 
  | EndNodeData;

// Automation action from API
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

// Workflow execution result
export interface SimulationStep {
  nodeId: string;
  nodeTitle: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors?: string[];
}