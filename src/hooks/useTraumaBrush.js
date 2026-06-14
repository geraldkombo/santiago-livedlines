import { useState, useEffect } from 'react';
import { saveToLedger, getFromLedger } from '../components/LocalLedger';

export const useTraumaBrush = () => {
  const [strokes, setStrokes] = useState(() => getFromLedger('picket_hazards') || []);
  const [isPainting, setIsPainting] = useState(false);

  useEffect(() => {
    saveToLedger('picket_hazards', strokes);
  }, [strokes]);

  const addStroke = (geoJson) => setStrokes(prev => [...prev, geoJson]);
  const undoStroke = () => setStrokes(prev => prev.slice(0, -1));
  const clearStrokes = () => setStrokes([]);

  return { strokes, isPainting, setIsPainting, addStroke, undoStroke, clearStrokes };
};
