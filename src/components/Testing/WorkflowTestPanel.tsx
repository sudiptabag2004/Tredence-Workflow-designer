import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { mockApi } from '../../api/mockApi';
import type { SimulationResult } from '../../types/workflow.types';
import { FaPlay, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const WorkflowTestPanel = () => {
  const { nodes, edges } = useWorkflowStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const runSimulation = async () => {
    setIsSimulating(true);
    setShowPanel(true);
    setResult(null);

    try {
      const workflow = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      };

      const simulationResult = await mockApi.simulateWorkflow(workflow);
      setResult(simulationResult);
    } catch (error) {
      console.error('Simulation failed:', error);
      setResult({
        success: false,
        steps: [],
        errors: ['Simulation failed due to an error'],
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <>
      {/* Test Button - Fixed Position */}
      {!showPanel && (
        <button
          onClick={runSimulation}
          disabled={nodes.length === 0}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            padding: '14px 28px',
            background: nodes.length === 0 ? '#cbd5e1' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (nodes.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.25)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
          }}
        >
          <FaPlay /> Test Workflow
        </button>
      )}

      {/* Results Panel - Fixed Position */}
      {showPanel && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            width: '420px',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
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
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
              Workflow Simulation
            </h3>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                color: '#64748b',
                padding: '0',
                width: '30px',
                height: '30px',
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
              ×
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              padding: '20px',
              overflowY: 'auto',
              flex: 1,
              maxHeight: '450px',
            }}
          >
            {isSimulating && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '40px 20px',
                }}
              >
                <FaSpinner
                  style={{
                    fontSize: '32px',
                    color: '#10b981',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  Running simulation...
                </div>
              </div>
            )}

            {!isSimulating && result && (
              <div>
                {/* Status Banner */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: result.success ? '#d1fae5' : '#fee2e2',
                    color: result.success ? '#065f46' : '#991b1b',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500',
                  }}
                >
                  {result.success ? (
                    <>
                      <FaCheck /> Simulation Successful
                    </>
                  ) : (
                    <>
                      <FaTimes /> Simulation Failed
                    </>
                  )}
                </div>

                {/* Errors */}
                {result.errors && result.errors.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '8px',
                      }}
                    >
                      Errors:
                    </div>
                    {result.errors.map((error, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px 12px',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#991b1b',
                          marginBottom: '6px',
                        }}
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                )}

                {/* Execution Steps */}
                {result.steps.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '12px',
                      }}
                    >
                      Execution Steps:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.steps.map((step, index) => (
                        <div
                          key={step.nodeId}
                          style={{
                            padding: '12px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '4px',
                            }}
                          >
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#10b981',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {index + 1}
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                              {step.nodeTitle}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: '13px',
                              color: '#64748b',
                              marginLeft: '32px',
                            }}
                          >
                            {step.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px',
              background: '#f8fafc',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
            }}
          >
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              style={{
                flex: 1,
                padding: '10px',
                background: isSimulating ? '#cbd5e1' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Run Again
            </button>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                padding: '10px 20px',
                background: '#fff',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default WorkflowTestPanel;