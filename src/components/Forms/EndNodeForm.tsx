import type { Node } from 'reactflow';
import type { EndNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { useState } from 'react';

interface Props {
  node: Node<EndNodeData>;
}

const EndNodeForm = ({ node }: Props) => {
  const { updateNodeData } = useWorkflowStore();
  
  const [endMessage, setEndMessage] = useState(node.data.endMessage || '');
  const [showSummary, setShowSummary] = useState(node.data.showSummary || false);

  const handleEndMessageChange = (value: string) => {
    setEndMessage(value);
    updateNodeData(node.id, { endMessage: value, label: value || 'Workflow Complete' });
  };

  const handleShowSummaryChange = (checked: boolean) => {
    setShowSummary(checked);
    updateNodeData(node.id, { showSummary: checked });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* End Message */}
      <div>
        <label style={labelStyle}>End Message</label>
        <textarea
          value={endMessage}
          onChange={(e) => handleEndMessageChange(e.target.value)}
          placeholder="e.g., Onboarding completed successfully!"
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Show Summary Toggle */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showSummary}
            onChange={(e) => handleShowSummaryChange(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', color: '#475569' }}>
            Show workflow summary
          </span>
        </label>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', marginLeft: '24px' }}>
          Display a summary of all completed steps
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

export default EndNodeForm;