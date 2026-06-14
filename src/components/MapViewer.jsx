import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useTraumaBrush } from '../hooks/useTraumaBrush';
import PICKetOverlay from './PICKetOverlay';

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const PaintBrush = ({ isPainting, addStroke }) => {
  useMapEvents({
    click(e) {
      if (!isPainting) return;
      const feature = {
        type: 'Feature',
        properties: { timestamp: Date.now(), type: 'hazard_mark' },
        geometry: { type: 'Point', coordinates: [e.latlng.lng, e.latlng.lat] }
      };
      addStroke(feature);
    }
  });
  return null;
};

const CollectionClickCatcher = ({ active, onCoords }) => {
  useMapEvents({
    click(e) {
      if (!active) return;
      onCoords({ lng: e.latlng.lng, lat: e.latlng.lat });
    }
  });
  return null;
};

const MapViewer = ({ spatialData, ward, wardLabel, cycleWard, handleFileUpload, placingCollection, onCollectionCoords }) => {
  const { strokes, isPainting, setIsPainting, addStroke, undoStroke, clearStrokes } = useTraumaBrush();

  if (!spatialData) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Loading ward geospatial data...
      </div>
    );
  }

  const wardCenters = {
    mathare: [-1.2567, 36.8571],
    dandora: [-1.2527, 36.8805],
    kibera: [-1.3155, 36.7667],
    kawangware: [-1.2745, 36.7196]
  };
  const mapCenter = wardCenters[ward] || wardCenters.mathare;

  const getBuildingStyle = (feature) => {
    const status = feature.properties.status;
    if (status === 'Zone 1') {
      return { color: '#ef4444', weight: 1.5, fillColor: '#ef4444', fillOpacity: 0.7 };
    }
    if (status === 'Zone 2') {
      return { color: '#f97316', weight: 1.5, fillColor: '#f97316', fillOpacity: 0.6 };
    }
    return { color: '#22c55e', weight: 1, fillColor: '#22c55e', fillOpacity: 0.4 };
  };

  const strokeCollection = strokes.length > 0 ? {
    type: 'FeatureCollection',
    features: strokes
  } : null;

  return (
    <div className="relative h-full w-full">
      <PICKetOverlay
        isPainting={isPainting}
        togglePainting={() => setIsPainting(!isPainting)}
        onUndo={undoStroke}
        onClear={clearStrokes}
        handleFileUpload={handleFileUpload}
        ward={ward}
        wardLabel={wardLabel}
        cycleWard={cycleWard}
      />

      <MapContainer center={mapCenter} zoom={15} className="h-full w-full relative z-0" style={{ cursor: isPainting || placingCollection ? 'crosshair' : 'default' }} preferCanvas={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <RecenterMap center={mapCenter} />

        <GeoJSON
          key={`b60-${ward}`}
          data={spatialData.buffer60}
          style={{ color: '#fb923c', weight: 0, fillColor: '#fb923c', fillOpacity: 0.2 }}
        />

        <GeoJSON
          key={`b30-${ward}`}
          data={spatialData.buffer30}
          style={{ color: '#f87171', weight: 0, fillColor: '#f87171', fillOpacity: 0.25 }}
        />

        <GeoJSON
          key={`ds-${ward}`}
          data={spatialData.dumpsiteLine}
          style={{ color: '#0f172a', weight: 3, dashArray: '6, 6' }}
        />

        <GeoJSON
          key={`build-${ward}-${spatialData.buildings.features.length}`}
          data={spatialData.buildings}
          style={getBuildingStyle}
        />

        {strokeCollection && (
          <GeoJSON
            key={`strokes-${strokes.length}`}
            data={strokeCollection}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 8,
                fillColor: '#a855f7',
                color: '#7e22ce',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7,
                renderer: L.canvas()
              });
            }}
          />
        )}

        <PaintBrush isPainting={isPainting} addStroke={addStroke} />
        <CollectionClickCatcher active={placingCollection} onCoords={onCollectionCoords} />
      </MapContainer>
    </div>
  );
};

export default MapViewer;
