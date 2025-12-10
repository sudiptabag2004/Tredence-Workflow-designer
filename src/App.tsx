import WorkflowCanvas from './components/Canvas/WorkflowCanvas';
import Sidebar from './components/Canvas/Sidebar';
import NodeEditPanel from './components/Forms/NodeEditPanel';
import WorkflowTestPanel from './components/Testing/WorkflowTestPanel';
import { ReactFlowProvider } from 'reactflow';
import { FaGithub, FaTrash, FaDownload } from 'react-icons/fa';
import { useWorkflowStore } from './store/workflowStore';

function App() {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();

  const handleClearWorkflow = () => {
    if (window.confirm('Are you sure you want to clear the entire workflow?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  const handleExportWorkflow = () => {
    const workflow = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };

    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: '#1e293b',
          color: '#fff',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          flexShrink: 0,
          minHeight: '70px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            🔄
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600', lineHeight: '1.3' }}>
              HR Workflow Designer
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.3' }}>
              Build and test internal workflows visually
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={handleExportWorkflow}
            disabled={nodes.length === 0}
            style={{
              padding: '8px 14px',
              background: nodes.length === 0 ? '#334155' : '#10b981',
              color: nodes.length === 0 ? '#64748b' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <FaDownload /> Export
          </button>

          <button
            onClick={handleClearWorkflow}
            disabled={nodes.length === 0}
            style={{
              padding: '8px 14px',
              background: nodes.length === 0 ? '#334155' : '#ef4444',
              color: nodes.length === 0 ? '#64748b' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <FaTrash /> Clear
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 14px',
              background: '#475569',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <FaGithub /> GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <ReactFlowProvider>
          <Sidebar />

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
            <WorkflowCanvas />
            
            {nodes.length === 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#fff',
                  padding: '32px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  maxWidth: '400px',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  👋
                </div>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#1e293b' }}>
                  Welcome to Workflow Designer
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                  Get started by dragging nodes from the left sidebar onto this canvas.
                  Connect them to create your workflow, then click on any node to edit its properties.
                </p>
              </div>
            )}
          </div>

          <NodeEditPanel />
        </ReactFlowProvider>
      </div>

      <WorkflowTestPanel />
    </div>
  );
}

export default App;