import { create } from 'zustand'

// Make sure "export" is here!
export const useFlowStore = create((set) => ({
    mode: 'editor',
    nodes: [
        { id: '1', text: 'Hello! How can we help you today?', x: 100, y: 200, type: 'start' },
        { id: '2', text: 'Are you looking for billing support?', x: 450, y: 100, type: 'question' },
        { id: '3', text: 'Please contact us at support@flow.com', x: 800, y: 300, type: 'end' }
    ],
    edges: [
        { source: '1', target: '2', label: 'Yes' },
        { source: '1', target: '3', label: 'No' }
    ],
    selectedNodeId: null,
    setMode: (mode) => set({ mode }),
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    updateNodeText: (id, text) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, text } : n)
    })),
    updateNodePosition: (id, x, y) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, x, y } : n)
    }))
})) // No semicolon here inside the create function