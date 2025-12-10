import { useWorkflowStore } from '../../store/workflowStore';
import StartNodeForm from './StartNodeForm';
import TaskNodeForm from './TaskNodeForm';
import ApprovalNodeForm from './ApprovalNodeForm';
import AutomatedStepForm from './AutomatedStepForm';
import EndNodeForm from './EndNodeForm';
import { FaTimes } from 'react-icons/fa';
import type { Node } from 'reactflow';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedStepNodeData, EndNodeData } from '../../types/workflow.types';

const NodeEditPanel = () => {
  const { nodes, selectedNodeId, setSelectedNodeId } = useWorkflowStore();

  // Find the selected node
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // If no node is selected, don't show the panel
  if (!selectedNode) {
    return null;
  }

  // Render the appropriate form based on node type
  const renderForm = () => {
    switch (selectedNode.data.type) {
      case 'start':
        return <StartNodeForm node={selectedNode as Node<StartNodeData>} />;
      case 'task':
        return <TaskNodeForm node={selectedNode as Node<TaskNodeData>} />;
      case 'approval':
        return <ApprovalNodeForm node={selectedNode as Node<ApprovalNodeData>} />;
      case 'automated':
        return <AutomatedStepForm node={selectedNode as Node<AutomatedStepNodeData>} />;
      case 'end':
        return <EndNodeForm node={selectedNode as Node<EndNodeData>} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div
      style={{
        width: '340px',
        minWidth: '340px',
        maxWidth: '340px',
        background: '#fff',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
          flexShrink: 0,
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
          Edit Node
        </h3>
        <button
          onClick={() => setSelectedNodeId(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '20px',
            padding: '4px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Form - Scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        {renderForm()}
      </div>
    </div>
  );
};

export default NodeEditPanel;