import React, { useState, useEffect } from 'react';
import { MATERIAL_HEURISTICS, CONTAINER_VOLUMES, estimateWeight } from '../utils/heuristicsEngine';
import { Scale, MapPin, Crosshair } from 'lucide-react';

const CollectionForm = ({ placing, onPlaceRequest, pendingCoords, onSave }) => {
  const [material, setMaterial] = useState('PET');
  const [container, setContainer] = useState('GUNIA');
  const [fullness, setFullness] = useState(100);

  useEffect(() => {
    if (!pendingCoords) return;
  }, [pendingCoords]);

  const estimatedKg = estimateWeight(material, container, fullness);

  const handleSave = () => {
    if (!pendingCoords) return;
    onSave({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [pendingCoords.lng, pendingCoords.lat]
      },
      properties: {
        timestamp: Date.now(),
        type: 'collection_log',
        ward: '',
        materialType: material,
        container: container,
        fullness: fullness,
        estimatedWeight: estimatedKg,
        eprCategory: MATERIAL_HEURISTICS[material].eprCategory
      }
    });
  };

  return (
    <div className="bg-slate-800 bg-opacity-50 border border-slate-700 p-4 rounded-lg flex flex-col gap-3">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <Scale className="w-4 h-4 text-amber-400" /> Log Collection
      </h2>

      <select
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded p-2.5 text-xs text-slate-200 font-medium"
      >
        {Object.entries(MATERIAL_HEURISTICS).map(([key, data]) => (
          <option key={key} value={key}>{data.label}</option>
        ))}
      </select>

      <select
        value={container}
        onChange={(e) => setContainer(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded p-2.5 text-xs text-slate-200 font-medium"
      >
        {Object.entries(CONTAINER_VOLUMES).map(([key, data]) => (
          <option key={key} value={key}>{data.label}</option>
        ))}
      </select>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">Fullness</span>
          <span className="font-mono text-amber-400 font-bold">{fullness}%</span>
        </div>
        <input
          type="range"
          min="25"
          max="100"
          step="25"
          value={fullness}
          onChange={(e) => setFullness(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer h-1 bg-slate-900 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded p-3 text-center">
        <span className="block text-lg font-bold font-mono text-emerald-400">{estimatedKg} kg</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Estimated Weight</span>
      </div>

      {!pendingCoords ? (
        <button
          onClick={onPlaceRequest}
          disabled={placing}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold transition-colors w-full ${placing ? 'bg-sky-700 text-white animate-pulse' : 'bg-sky-700 hover:bg-sky-600 text-white'}`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          {placing ? 'Tap Map to Place...' : 'Place on Map'}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="bg-slate-900 border border-emerald-700 rounded p-2 text-center">
            <span className="text-[10px] text-emerald-400 font-mono">
              <MapPin className="w-3 h-3 inline mr-1" />
              [{pendingCoords.lat.toFixed(5)}, {pendingCoords.lng.toFixed(5)}]
            </span>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors w-full"
          >
            <Scale className="w-3.5 h-3.5" /> Log Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionForm;
