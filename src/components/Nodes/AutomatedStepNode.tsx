import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { AutomatedStepNodeData } from '../../types/workflow.types';
import { FaCog, FaTimes } from 'react-icons/fa';
import { useWorkflowStore } from '../../store/workflowStore';

const AutomatedStepNode = memo(({ data, selected, id }: NodeProps<AutomatedStepNodeData>) => {
  const { deleteNode } = useWorkflowStore();

  return (
    <div
      style={{
        position: 'relative',
        padding: '15px 20px',
        borderRadius: '8px',
        background: selected ? '#e0e7ff' : '#fff',
        border: `2px solid ${selected ? '#6366f1' : '#94a3b8'}`,
        minWidth: '180px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#6366f1',
          width: '10px',
          height: '10px',
        }}
      />

      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Delete this node?')) {
              deleteNode(id);
            }
          }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ef4444',
            color: '#fff',
            border: '2px solid #fff',
            cursor: 'pointer',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ef4444';
          }}
        >
          <FaTimes />
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaCog style={{ color: '#6366f1' }} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Automated</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {data.title || 'Untitled Action'}
          </div>
          {data.actionId && (
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              ⚙️ {data.actionId}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#6366f1',
          width: '10px',
          height: '10px',
        }}
      />
    </div>
  );
});

AutomatedStepNode.displayName = 'AutomatedStepNode';

export default AutomatedStepNode;