import React, { useState, useRef } from 'react'
import { useFlowStore } from './store/flowStore'

const Connector = ({ start, end }) => {
    const x1 = start.x + 190; const y1 = start.y + 40;
    const x2 = end.x; const y2 = end.y + 40;
    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            <path d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                stroke="#94a3b8" strokeWidth="3" fill="none" />
        </svg>
    );
};

export default function App() {
    const { nodes, edges, mode, setMode, selectedNodeId, setSelectedNodeId, updateNodeText, updateNodePosition } = useFlowStore()
    const [prevId, setPrevId] = useState('1')
    const dragNode = useRef(null)

    if (mode === 'preview') {
        const node = nodes.find(n => n.id === prevId)
        const opts = edges.filter(e => e.source === prevId)
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
                <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-slate-700">
                    <p className="text-xl mb-8">{node?.text || "End."}</p>
                    {opts.map(e => (
                        <button key={e.target} onClick={() => setPrevId(e.target)} className="w-full py-3 bg-blue-600 mb-2 rounded-xl">{e.label}</button>
                    ))}
                    <button onClick={() => { setMode('editor'); setPrevId('1'); }} className="w-full py-3 border border-slate-600 rounded-xl mt-4">Back to Editor</button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-screen h-screen bg-slate-50 overflow-hidden" onMouseMove={(e) => dragNode.current && updateNodePosition(dragNode.current, e.clientX - 100, e.clientY - 40)} onMouseUp={() => dragNode.current = null}>
            <div className="absolute top-6 left-6 z-20">
                <button onClick={() => setMode('preview')} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-lg">Run Preview</button>
            </div>
            <div className="absolute inset-0">
                {edges.map((e, i) => <Connector key={i} start={nodes.find(n => n.id === e.source)} end={nodes.find(n => n.id === e.target)} />)}
            </div>
            {nodes.map(n => (
                <div key={n.id} onMouseDown={() => dragNode.current = n.id} onClick={() => setSelectedNodeId(n.id)} style={{ left: n.x, top: n.y }}
                    className={`absolute w-48 p-4 bg-white border-2 rounded-xl shadow-md cursor-move ${selectedNodeId === n.id ? 'border-indigo-500' : 'border-slate-200'}`}>
                    <p className="text-slate-700 text-sm">{n.text}</p>
                </div>
            ))}
            {selectedNodeId && (
                <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl p-8 border-l z-30">
                    <h2 className="font-bold mb-4">Edit Node</h2>
                    <textarea className="w-full h-40 p-4 border rounded-xl" value={nodes.find(n => n.id === selectedNodeId)?.text} onChange={(e) => updateNodeText(selectedNodeId, e.target.value)} />
                    <button onClick={() => setSelectedNodeId(null)} className="mt-4 w-full py-2 bg-slate-100 rounded-lg">Close</button>
                </div>
            )}
        </div>
    )
}