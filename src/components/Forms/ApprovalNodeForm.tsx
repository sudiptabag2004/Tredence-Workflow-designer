import type { Node } from 'reactflow';
import type { ApprovalNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { useState } from 'react';

interface Props {
  node: Node<ApprovalNodeData>;
}

const ApprovalNodeForm = ({ node }: Props) => {
  const { updateNodeData } = useWorkflowStore();
  
  const [title, setTitle] = useState(node.data.title || '');
  const [approverRole, setApproverRole] = useState(node.data.approverRole || '');
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(
    node.data.autoApproveThreshold?.toString() || ''
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    updateNodeData(node.id, { title: value, label: value });
  };

  const handleApproverRoleChange = (value: string) => {
    setApproverRole(value);
    updateNodeData(node.id, { approverRole: value });
  };

  const handleThresholdChange = (value: string) => {
    setAutoApproveThreshold(value);
    const numValue = value ? parseFloat(value) : undefined;
    updateNodeData(node.id, { autoApproveThreshold: numValue });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title */}
      <div>
        <label style={labelStyle}>Approval Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g., Manager Approval"
          style={inputStyle}
        />
      </div>

      {/* Approver Role */}
      <div>
        <label style={labelStyle}>Approver Role</label>
        <select
          value={approverRole}
          onChange={(e) => handleApproverRoleChange(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Role...</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="CEO">CEO</option>
        </select>
      </div>

      {/* Auto-approve Threshold */}
      <div>
        <label style={labelStyle}>Auto-Approve Threshold</label>
        <input
          type="number"
          value={autoApproveThreshold}
          onChange={(e) => handleThresholdChange(e.target.value)}
          placeholder="e.g., 1000"
          style={inputStyle}
          min="0"
          step="0.01"
        />
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          Automatically approve if amount is below this value
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#475569',
  marginBottom: '6px',
} as const;

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box' as const,
};

export default ApprovalNodeForm;