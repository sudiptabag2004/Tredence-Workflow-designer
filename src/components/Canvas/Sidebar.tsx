import React from 'react';
import { FaPlay, FaTasks, FaCheckCircle, FaCog, FaFlag } from 'react-icons/fa';
import type { NodeType } from '../../types/workflow.types';

interface NodeOption {
  type: NodeType;
  label: string;
  icon: React.ReactElement;
  color: string;
}

const nodeOptions: NodeOption[] = [
  { type: 'start', label: 'Start', icon: <FaPlay />, color: '#10b981' },
  { type: 'task', label: 'Task', icon: <FaTasks />, color: '#f59e0b' },
  { type: 'approval', label: 'Approval', icon: <FaCheckCircle />, color: '#8b5cf6' },
  { type: 'automated', label: 'Automated', icon: <FaCog />, color: '#6366f1' },
  { type: 'end', label: 'End', icon: <FaFlag />, color: '#ef4444' },
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        width: '240px',
        minWidth: '240px',
        maxWidth: '240px',
        background: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto',
        height: '100%',
        flexShrink: 0,
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
          Workflow Nodes
        </h3>
        
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
          Drag and drop nodes onto the canvas
        </p>
      </div>

      {nodeOptions.map((option) => (
        <div
          key={option.type}
          draggable
          onDragStart={(e) => onDragStart(e, option.type)}
          style={{
            padding: '12px 14px',
            background: '#fff',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = option.color;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ color: option.color, fontSize: '18px', display: 'flex', alignItems: 'center' }}>
            {option.icon}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
            {option.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;