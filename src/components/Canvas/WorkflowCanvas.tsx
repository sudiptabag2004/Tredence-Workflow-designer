import { useCallback, useRef, useEffect } from 'react';
import type { DragEvent } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import type {
  Connection,
  Edge,
  NodeTypes,
  Node,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import type { NodeType, WorkflowNodeData } from '../../types/workflow.types';

import StartNode from '../Nodes/StartNode';
import TaskNode from '../Nodes/TaskNode';
import ApprovalNode from '../Nodes/ApprovalNode';
import AutomatedStepNode from '../Nodes/AutomatedStepNode';
import EndNode from '../Nodes/EndNode';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};

const WorkflowCanvas = () => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    setSelectedNodeId,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Sync store to local state when store changes
  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  // Sync local state to store
  useEffect(() => {
    setStoreNodes(nodes);
  }, [nodes, setStoreNodes]);

  useEffect(() => {
    setStoreEdges(edges);
  }, [edges, setStoreEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}`,
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      } as Edge;

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!type || !reactFlowInstance.current || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

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

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100%', background: '#fafafa' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'start':
                return '#10b981';
              case 'task':
                return '#f59e0b';
              case 'approval':
                return '#8b5cf6';
              case 'automated':
                return '#6366f1';
              case 'end':
                return '#ef4444';
              default:
                return '#94a3b8';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;