import type { AutomationAction, SimulationResult, SimulationStep } from '../types/workflow.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockAutomations: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create Support Ticket', params: ['priority', 'description'] },
  { id: 'notify_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'update_database', label: 'Update Database', params: ['table', 'data'] },
];

export const mockApi = {
  getAutomations: async (): Promise<AutomationAction[]> => {
    await delay(300);
    return mockAutomations;
  },

  simulateWorkflow: async (workflow: any): Promise<SimulationResult> => {
    await delay(800); // Longer delay to feel more realistic

    const steps: SimulationStep[] = [];
    const errors: string[] = [];

    // Validation 1: Check if workflow has nodes
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return {
        success: false,
        steps: [],
        errors: ['Workflow is empty. Add at least one node to begin.'],
      };
    }

    // Validation 2: Check for Start node
    const startNodes = workflow.nodes.filter((n: any) => n.data.type === 'start');
    if (startNodes.length === 0) {
      errors.push('❌ Workflow must have a Start node');
    } else if (startNodes.length > 1) {
      errors.push('⚠️ Workflow has multiple Start nodes. Only one is recommended.');
    }

    // Validation 3: Check for End node
    const endNodes = workflow.nodes.filter((n: any) => n.data.type === 'end');
    if (endNodes.length === 0) {
      errors.push('❌ Workflow must have an End node');
    }

    // Validation 4: Check if Start node has outgoing connections
    if (startNodes.length > 0) {
      const startNode = startNodes[0];
      const hasOutgoing = workflow.edges.some((e: any) => e.source === startNode.id);
      if (!hasOutgoing) {
        errors.push('❌ Start node is not connected to any other node');
      }
    }

    // Validation 5: Check if End node has incoming connections
    if (endNodes.length > 0) {
      const endNode = endNodes[0];
      const hasIncoming = workflow.edges.some((e: any) => e.target === endNode.id);
      if (!hasIncoming) {
        errors.push('❌ End node is not connected from any other node');
      }
    }

    // Validation 6: Check for disconnected nodes
    workflow.nodes.forEach((node: any) => {
      const hasIncoming = workflow.edges.some((e: any) => e.target === node.id);
      const hasOutgoing = workflow.edges.some((e: any) => e.source === node.id);

      if (node.data.type !== 'start' && node.data.type !== 'end') {
        if (!hasIncoming || !hasOutgoing) {
          errors.push(`⚠️ Node "${node.data.label || node.data.title}" is not fully connected`);
        }
      }
    });

    // Validation 7: Check for required fields
    workflow.nodes.forEach((node: any) => {
      if (node.data.type === 'task') {
        if (!node.data.title || node.data.title.trim() === '' || node.data.title === 'New Task') {
          errors.push(`⚠️ Task node needs a proper title`);
        }
        if (!node.data.assignee || node.data.assignee.trim() === '') {
          errors.push(`⚠️ Task "${node.data.title}" has no assignee`);
        }
      }
      if (node.data.type === 'approval') {
        if (!node.data.approverRole || node.data.approverRole.trim() === '') {
          errors.push(`⚠️ Approval node "${node.data.title}" has no approver role set`);
        }
      }
      if (node.data.type === 'automated') {
        if (!node.data.actionId || node.data.actionId.trim() === '') {
          errors.push(`⚠️ Automated node "${node.data.title}" has no action selected`);
        }
      }
    });

    // If there are critical errors (❌), stop simulation
    const criticalErrors = errors.filter(e => e.startsWith('❌'));
    if (criticalErrors.length > 0) {
      return {
        success: false,
        steps: [],
        errors: errors,
      };
    }

    // Simulate execution of each node
    // Sort nodes by connection order (simple approach)
    const sortedNodes = [...workflow.nodes];
    
    sortedNodes.forEach((node: any, index: number) => {
      let status: 'completed' | 'pending' | 'failed' = 'completed';
      let message = '';

      switch (node.data.type) {
        case 'start':
          message = `Workflow initiated: ${node.data.title}`;
          break;
        case 'task':
          message = node.data.assignee 
            ? `Task assigned to ${node.data.assignee}${node.data.dueDate ? ` (Due: ${node.data.dueDate})` : ''}`
            : `Task created but no assignee specified`;
          break;
        case 'approval':
          message = node.data.approverRole
            ? `Approval request sent to ${node.data.approverRole}`
            : `Approval step configured`;
          break;
        case 'automated':
          const action = mockAutomations.find(a => a.id === node.data.actionId);
          message = action 
            ? `Executed automated action: ${action.label}`
            : `Automated step executed`;
          break;
        case 'end':
          message = node.data.endMessage || 'Workflow completed successfully';
          break;
        default:
          message = `Executed ${node.data.type} node`;
      }

      steps.push({
        nodeId: node.id,
        nodeTitle: node.data.label || node.data.title || `Node ${index + 1}`,
        status,
        message,
      });
    });

    // Success if only warnings (⚠️), not critical errors
    return {
      success: criticalErrors.length === 0,
      steps,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};