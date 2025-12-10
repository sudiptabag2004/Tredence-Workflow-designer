import type { Node } from 'reactflow';
import type { AutomatedStepNodeData, AutomationAction } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { useState, useEffect } from 'react';
import { mockApi } from '../../api/mockApi';

interface Props {
  node: Node<AutomatedStepNodeData>;
}

const AutomatedStepForm = ({ node }: Props) => {
  const { updateNodeData } = useWorkflowStore();
  
  const [title, setTitle] = useState(node.data.title || '');
  const [actionId, setActionId] = useState(node.data.actionId || '');
  const [actionParams, setActionParams] = useState(node.data.actionParams || {});
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available automations when component mounts
  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const data = await mockApi.getAutomations();
        setAutomations(data);
      } catch (error) {
        console.error('Failed to fetch automations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAutomations();
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    updateNodeData(node.id, { title: value, label: value });
  };

  const handleActionChange = (value: string) => {
    setActionId(value);
    // Reset params when action changes
    setActionParams({});
    updateNodeData(node.id, { actionId: value, actionParams: {} });
  };

  const handleParamChange = (paramName: string, value: string) => {
    const updatedParams = { ...actionParams, [paramName]: value };
    setActionParams(updatedParams);
    updateNodeData(node.id, { actionParams: updatedParams });
  };

  const selectedAction = automations.find((a) => a.id === actionId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title */}
      <div>
        <label style={labelStyle}>Action Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g., Send welcome email"
          style={inputStyle}
        />
      </div>

      {/* Action Selection */}
      <div>
        <label style={labelStyle}>Select Action</label>
        {loading ? (
          <div style={{ padding: '8px', color: '#64748b', fontSize: '13px' }}>
            Loading actions...
          </div>
        ) : (
          <select
            value={actionId}
            onChange={(e) => handleActionChange(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select an action...</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dynamic Parameters based on selected action */}
      {selectedAction && (
        <div>
          <label style={labelStyle}>Action Parameters</label>
          {selectedAction.params.map((param) => (
            <div key={param} style={{ marginBottom: '12px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '4px',
                }}
              >
                {param}
              </label>
              <input
                type="text"
                value={actionParams[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}...`}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      )}
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

export default AutomatedStepForm;