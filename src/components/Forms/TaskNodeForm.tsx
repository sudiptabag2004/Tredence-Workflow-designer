import type { Node } from 'reactflow';
import type { TaskNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { useState } from 'react';

interface Props {
  node: Node<TaskNodeData>;
}

const TaskNodeForm = ({ node }: Props) => {
  const { updateNodeData } = useWorkflowStore();
  
  const [title, setTitle] = useState(node.data.title || '');
  const [description, setDescription] = useState(node.data.description || '');
  const [assignee, setAssignee] = useState(node.data.assignee || '');
  const [dueDate, setDueDate] = useState(node.data.dueDate || '');
  const [customFields, setCustomFields] = useState(node.data.customFields || {});
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    updateNodeData(node.id, { title: value, label: value });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    updateNodeData(node.id, { description: value });
  };

  const handleAssigneeChange = (value: string) => {
    setAssignee(value);
    updateNodeData(node.id, { assignee: value });
  };

  const handleDueDateChange = (value: string) => {
    setDueDate(value);
    updateNodeData(node.id, { dueDate: value });
  };

  const addCustomField = () => {
    if (newFieldKey && newFieldValue) {
      const updatedFields = { ...customFields, [newFieldKey]: newFieldValue };
      setCustomFields(updatedFields);
      updateNodeData(node.id, { customFields: updatedFields });
      setNewFieldKey('');
      setNewFieldValue('');
    }
  };

  const removeCustomField = (key: string) => {
    const updatedFields = { ...customFields };
    delete updatedFields[key];
    setCustomFields(updatedFields);
    updateNodeData(node.id, { customFields: updatedFields });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title */}
      <div>
        <label style={labelStyle}>Task Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g., Complete background check"
          style={inputStyle}
        />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe the task..."
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Assignee */}
      <div>
        <label style={labelStyle}>Assignee</label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => handleAssigneeChange(e.target.value)}
          placeholder="e.g., HR Manager"
          style={inputStyle}
        />
      </div>

      {/* Due Date */}
      <div>
        <label style={labelStyle}>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => handleDueDateChange(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Custom Fields */}
      <div>
        <label style={labelStyle}>Custom Fields</label>
        
        {Object.entries(customFields).map(([key, value]) => (
          <div key={key} style={customFieldContainerStyle}>
            <div style={{ flex: 1, fontSize: '13px' }}>
              <strong>{key}:</strong> {value}
            </div>
            <button onClick={() => removeCustomField(key)} style={removeButtonStyle}>
              Remove
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input
            type="text"
            value={newFieldKey}
            onChange={(e) => setNewFieldKey(e.target.value)}
            placeholder="Field name"
            style={smallInputStyle}
          />
          <input
            type="text"
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
            placeholder="Value"
            style={smallInputStyle}
          />
        </div>
        <button
          onClick={addCustomField}
          disabled={!newFieldKey || !newFieldValue}
          style={addButtonStyle(!!newFieldKey && !!newFieldValue)}
        >
          Add Field
        </button>
      </div>
    </div>
  );
};

// Reusable styles
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

const smallInputStyle = {
  flex: 1,
  padding: '6px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '13px',
};

const customFieldContainerStyle = {
  display: 'flex',
  gap: '8px',
  marginBottom: '8px',
  padding: '8px',
  background: '#f1f5f9',
  borderRadius: '4px',
  alignItems: 'center',
};

const removeButtonStyle = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '12px',
};

const addButtonStyle = (enabled: boolean) => ({
  marginTop: '8px',
  width: '100%',
  padding: '8px',
  background: enabled ? '#f59e0b' : '#cbd5e1',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: enabled ? 'pointer' : 'not-allowed',
  fontSize: '13px',
  fontWeight: '500',
});

export default TaskNodeForm;