import type { Node } from 'reactflow';
import type { StartNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { useState } from 'react';

interface Props {
  node: Node<StartNodeData>;
}

const StartNodeForm = ({ node }: Props) => {
  const { updateNodeData } = useWorkflowStore();
  
  // Local state for form fields
  const [title, setTitle] = useState(node.data.title || '');
  const [metadata, setMetadata] = useState(node.data.metadata || {});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // Update node when title changes
  const handleTitleChange = (value: string) => {
    setTitle(value);
    updateNodeData(node.id, { title: value, label: value });
  };

  // Add a new metadata key-value pair
  const addMetadata = () => {
    if (newKey && newValue) {
      const updatedMetadata = { ...metadata, [newKey]: newValue };
      setMetadata(updatedMetadata);
      updateNodeData(node.id, { metadata: updatedMetadata });
      setNewKey('');
      setNewValue('');
    }
  };

  // Remove a metadata entry
  const removeMetadata = (key: string) => {
    const updatedMetadata = { ...metadata };
    delete updatedMetadata[key];
    setMetadata(updatedMetadata);
    updateNodeData(node.id, { metadata: updatedMetadata });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title Field */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#475569',
            marginBottom: '6px',
          }}
        >
          Start Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g., Employee Onboarding"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Metadata Section */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#475569',
            marginBottom: '6px',
          }}
        >
          Metadata (Optional)
        </label>

        {/* Display existing metadata */}
        {Object.entries(metadata).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '8px',
              padding: '8px',
              background: '#f1f5f9',
              borderRadius: '4px',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1, fontSize: '13px' }}>
              <strong>{key}:</strong> {value}
            </div>
            <button
              onClick={() => removeMetadata(key)}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add new metadata */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key"
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '13px',
            }}
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '13px',
            }}
          />
        </div>
        <button
          onClick={addMetadata}
          disabled={!newKey || !newValue}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '8px',
            background: newKey && newValue ? '#10b981' : '#cbd5e1',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: newKey && newValue ? 'pointer' : 'not-allowed',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          Add Metadata
        </button>
      </div>
    </div>
  );
};

export default StartNodeForm;