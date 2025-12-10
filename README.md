# HR Workflow Designer - Developer Guide

A visual workflow designer for creating and testing HR workflows like onboarding, approvals, and document verification.

Built with: **React 18 + TypeScript + React Flow + Zustand**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Canvas/              # Main workflow canvas
│   │   ├── WorkflowCanvas.tsx    # React Flow canvas
│   │   └── Sidebar.tsx           # Draggable node palette
│   ├── Nodes/               # Custom node visuals
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedStepNode.tsx
│   │   └── EndNode.tsx
│   ├── Forms/               # Node edit forms
│   │   ├── NodeEditPanel.tsx     # Form container
│   │   └── *NodeForm.tsx         # Individual forms per node type
│   └── Testing/
│       └── WorkflowTestPanel.tsx # Workflow simulator
├── api/
│   └── mockApi.ts           # Mock API (GET automations, POST simulate)
├── store/
│   └── workflowStore.ts     # Zustand state management
├── types/
│   └── workflow.types.ts    # TypeScript interfaces
└── App.tsx                  # Main app layout
```

---

## 🏗️ Architecture Overview

### Core Technologies

- **React Flow**: Handles canvas, nodes, edges, drag-drop
- **Zustand**: Global state for nodes/edges (simpler than Redux)
- **TypeScript**: Type safety for node data structures

### Data Flow

1. User drags node from `Sidebar` → drops on `WorkflowCanvas`
2. Node added to Zustand store → triggers re-render
3. Click node → `selectedNodeId` updates → `NodeEditPanel` shows form
4. Edit form → updates store → node visual updates
5. Click "Test Workflow" → sends data to `mockApi.simulateWorkflow()` → shows results

---

## 🔧 Key Files Explained

### `workflow.types.ts`
Defines all node data structures:
```typescript
type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

interface TaskNodeData {
  type: 'task';
  title: string;
  assignee?: string;
  dueDate?: string;
  // ... more fields
}
```

### `workflowStore.ts`
Zustand store with actions:
```typescript
{
  nodes: [],
  edges: [],
  selectedNodeId: null,
  
  // Actions
  setNodes(), setEdges(),
  updateNodeData(nodeId, newData),
  addNode(), deleteNode()
}
```

### `WorkflowCanvas.tsx`
Main canvas logic:
- Handles drag-drop from sidebar
- Manages node connections
- Syncs React Flow state with Zustand store

### `NodeEditPanel.tsx`
Shows form based on selected node type:
```typescript
if (node.type === 'task') return <TaskNodeForm />
if (node.type === 'approval') return <ApprovalNodeForm />
```

### `mockApi.ts`
Simulates backend:
- `getAutomations()`: Returns list of automated actions
- `simulateWorkflow()`: Validates workflow and returns step-by-step execution

---

## 🎨 How to Add a New Node Type

### 1. Add Type Definition (`workflow.types.ts`)
```typescript
export interface MyNewNodeData extends BaseNodeData {
  type: 'mynewnode';
  myField: string;
}

export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | MyNewNodeData;  // Add here
```

### 2. Create Node Component (`components/Nodes/MyNewNode.tsx`)
```typescript
const MyNewNode = ({ data, selected }: NodeProps<MyNewNodeData>) => {
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div>{data.myField}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
```

### 3. Create Form Component (`components/Forms/MyNewNodeForm.tsx`)
```typescript
const MyNewNodeForm = ({ node }: Props) => {
  const { updateNodeData } = useWorkflowStore();
  
  return (
    <input 
      value={node.data.myField}
      onChange={(e) => updateNodeData(node.id, { myField: e.target.value })}
    />
  );
};
```

### 4. Register in Canvas (`WorkflowCanvas.tsx`)
```typescript
const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  mynewnode: MyNewNode,  // Add here
};
```

### 5. Add to Sidebar (`Sidebar.tsx`)
```typescript
const nodeOptions = [
  { type: 'mynewnode', label: 'My New Node', icon: <FaStar />, color: '#ff6b6b' }
];
```

---

## 🧪 Testing & Validation

### Mock API Validation
The `simulateWorkflow()` function checks:
- ❌ Must have Start and End nodes
- ❌ Start/End must be connected
- ⚠️ Warns if nodes are disconnected
- ⚠️ Warns if required fields are empty

### To Modify Validation
Edit `mockApi.ts` → `simulateWorkflow()` function

---

## 🎯 Common Tasks

### Change Node Appearance
Edit `components/Nodes/[NodeType].tsx` → modify inline styles

### Add New Form Field
1. Add to type definition in `workflow.types.ts`
2. Add input in `components/Forms/[NodeType]Form.tsx`
3. Call `updateNodeData()` on change

### Change Workflow JSON Structure
Export happens in `App.tsx` → `handleExportWorkflow()`

### Add Real API
Replace `mockApi.ts` with real API calls using axios

---

## 🐛 Common Issues

**Nodes not appearing after drag?**
- Check `onDrop` in `WorkflowCanvas.tsx`
- Verify node type is registered in `nodeTypes`

**Form not updating node?**
- Ensure `updateNodeData()` is called with correct `nodeId`
- Check Zustand store is connected

**Scrolling issues?**
- Check `index.css` has `overflow: hidden` on html/body/#root
- Verify App.tsx container has `overflow: hidden`

---

## 🔮 Future Enhancements

- [ ] Backend persistence (replace mockApi)
- [ ] Conditional branching (if/else nodes)
- [ ] Parallel execution paths
- [ ] Undo/Redo functionality
- [ ] Import JSON workflows
- [ ] Real-time collaboration

---

## 📝 Notes for Developers

- **No localStorage**: Data resets on refresh (by design for prototype)
- **Mock API only**: Replace with real backend for production
- **Type safety**: Always update `workflow.types.ts` when adding fields
- **State sync**: Canvas uses both React Flow state AND Zustand (needed for React Flow)

---

## 📞 Need Help?

- React Flow Docs: https://reactflow.dev/
- Zustand Docs: https://github.com/pmndrs/zustand
- TypeScript Handbook: https://www.typescriptlang.org/docs/