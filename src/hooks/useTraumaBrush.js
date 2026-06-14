import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db/pimaDb';

export const useTraumaBrush = () => {
  const [isPainting, setIsPainting] = useState(false);

  const strokes = useLiveQuery(() => db.features.toArray()) || [];

  const addStroke = async (geoJson) => {
    await db.features.add({
      type: 'Feature',
      geometry: geoJson.geometry,
      properties: {
        ...geoJson.properties,
        timestamp: geoJson.properties?.timestamp || Date.now()
      }
    });
  };

  const undoStroke = async () => {
    const last = await db.features.orderBy('id').last();
    if (last) await db.features.delete(last.id);
  };

  const clearStrokes = async () => {
    await db.features.clear();
  };

  return { strokes, isPainting, setIsPainting, addStroke, undoStroke, clearStrokes };
};
