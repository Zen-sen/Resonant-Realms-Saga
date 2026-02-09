import React from 'react';

export const TaskFlow = ({ tasks }: { tasks: any[] }) => (
  <div className="p-4 bg-black/40 border border-cyan-500/20 rounded-lg">
    <h3 className="text-cyan-400 text-xs mb-4 uppercase">System Roadmap</h3>
    {tasks.map(t => (
      <div key={t.id} className="flex items-center space-x-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${t.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`} />
        <span className="text-sm text-gray-300">{t.title}</span>
      </div>
    ))}
  </div>
);