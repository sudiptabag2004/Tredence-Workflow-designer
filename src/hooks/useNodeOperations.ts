import { useCallback } from 'react';
import type { Node } from 'reactflow';
import type { WorkflowNodeData, NodeType } from '../types/workflow.types';
import { useWorkflowStore } from '../store/workflowStore';

export const useNodeOperations = () => {
  const { nodes, addNode, deleteNode, updateNodeData } = useWorkflowStore();
  const typedNodes: Node<WorkflowNodeData>[] = nodes;

  const createNode = useCallback(
    (type: NodeType, position: { x: number; y: number }) => {
      const getDefaultData = (nodeType: NodeType): WorkflowNodeData => {
        switch (nodeType) {
          case 'start':
            return {
              type: 'start',
              label: 'Start',
              title: 'Workflow Start',
              metadata: {},
            };
          case 'task':
            return {
              type: 'task',
              label: 'Task',
              title: 'New Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {},
            };
          case 'approval':
            return {
              type: 'approval',
              label: 'Approval',
              title: 'New Approval',
              approverRole: '',
              autoApproveThreshold: undefined,
            };
          case 'automated':
            return {
              type: 'automated',
              label: 'Automated',
              title: 'New Action',
              actionId: '',
              actionParams: {},
            };
          case 'end':
            return {
              type: 'end',
              label: 'End',
              endMessage: 'Workflow Complete',
              showSummary: false,
            };
          default:
            return {
              type: 'start',
              label: 'Start',
              title: 'Workflow Start',
            };
        }
      };

      const newNode: Node<WorkflowNodeData> = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: getDefaultData(type),
      };

      addNode(newNode);
      return newNode;
    },
    [addNode]
  );

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const node = typedNodes.find((n: Node<WorkflowNodeData>) => n.id === nodeId);
      if (!node) return;

      const newNode: Node<WorkflowNodeData> = {
        ...node,
        id: `${node.type}-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      };

      addNode(newNode);
      return newNode;
    },
    [nodes, addNode]
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      deleteNode(nodeId);
    },
    [deleteNode]
  );

  return {
    createNode,
    duplicateNode,
    removeNode,
    updateNodeData,
  };
};

