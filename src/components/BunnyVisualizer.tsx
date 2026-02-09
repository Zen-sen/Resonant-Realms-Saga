import React from 'react';
import { DNA } from '../types';

interface VisualizerProps {
  dna: DNA;
  name: string;
}

export const BunnyVisualizer: React.FC<VisualizerProps> = ({ dna, name }) => {
  const isKaggen = dna.tribeId === 0;

  return (
    <div className="relative p-6 bg-gradient-to-br from-gray-900 to-black border-2 border-pink-500/30 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.2)]">
      <div className="absolute top-2 right-4 text-[10px] font-mono text-pink-500 uppercase tracking-widest">
        {isKaggen ? 'Ancestral Genesis' : 'Unit Manifest'}
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 rounded-full bg-gradient-to-t from-pink-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
           {/* This is where the D3.js or Sprite will eventually live */}
           <span className="text-4xl">🐰</span>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">{name}</h2>
          <p className="text-xs text-cyan-400 font-mono">Tribe ID: {dna.tribeId}</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-2 mt-4">
          <div className="bg-white/5 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase">Resonance</p>
            <p className="text-lg font-mono text-white">{dna.resonance}</p>
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase">Gen</p>
            <p className="text-lg font-mono text-white">{dna.generation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};