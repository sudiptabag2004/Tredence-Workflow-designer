import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
}

export const useWorkflowValidation = () => {
  const { nodes, edges } = useWorkflowStore();

  const errors = useMemo(() => {
    const validationErrors: ValidationError[] = [];

    if (nodes.length === 0) {
      return validationErrors;
    }

    // Check for Start node
    const startNodes = nodes.filter((n) => n.data.type === 'start');
    if (startNodes.length === 0) {
      validationErrors.push({
        type: 'error',
        message: 'Workflow must have a Start node',
      });
    } else if (startNodes.length > 1) {
      validationErrors.push({
        type: 'warning',
        message: 'Multiple Start nodes detected',
      });
    }

    // Check for End node
    const endNodes = nodes.filter((n) => n.data.type === 'end');
    if (endNodes.length === 0) {
      validationErrors.push({
        type: 'error',
        message: 'Workflow must have an End node',
      });
    }

    // Check for disconnected nodes
    nodes.forEach((node) => {
      const hasIncoming = edges.some((e) => e.target === node.id);
      const hasOutgoing = edges.some((e) => e.source === node.id);

      if (node.data.type === 'start' && !hasOutgoing) {
        validationErrors.push({
          type: 'warning',
          message: `Start node is not connected`,
          nodeId: node.id,
        });
      } else if (node.data.type === 'end' && !hasIncoming) {
        validationErrors.push({
          type: 'warning',
          message: `End node is not connected`,
          nodeId: node.id,
        });
      } else if (
        node.data.type !== 'start' &&
        node.data.type !== 'end' &&
        (!hasIncoming || !hasOutgoing)
      ) {
        validationErrors.push({
          type: 'warning',
          message: `Node "${node.data.label}" is not fully connected`,
          nodeId: node.id,
        });
      }
    });

    return validationErrors;
  }, [nodes, edges]);

  const hasErrors = errors.some((e) => e.type === 'error');
  const hasWarnings = errors.some((e) => e.type === 'warning');

  return {
    errors,
    hasErrors,
    hasWarnings,
    isValid: !hasErrors,
  };
};