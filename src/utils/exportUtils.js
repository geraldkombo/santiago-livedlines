function sortKeys(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortKeys);
  return Object.keys(obj).sort().reduce((acc, k) => {
    acc[k] = sortKeys(obj[k]);
    return acc;
  }, {});
}

async function sha256Hex(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  const bytes = new Uint8Array(hash);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

const EPR_CATEGORIES = {
  1: 'Category 1: Non-hazardous packaging (plastics, paper, glass, aluminum)',
  2: 'Category 2: Hazardous products packaging',
  3: 'Category 3: Electrical and Electronic Equipment (e-waste)',
  4: 'Category 4: End-of-life motor vehicles',
  5: 'Category 5: Non-packaging items'
};

export const generateAuditExport = async (strokes, visits) => {
  const features = strokes.map(s => ({
    type: 'Feature',
    geometry: s.geometry,
    properties: {
      collection_id: s.properties?.collectionId || `wr-${Date.now()}`,
      timestamp_iso: s.properties?.timestamp
        ? new Date(s.properties.timestamp).toISOString()
        : new Date().toISOString(),
      picker_coop_name: 'Nairobi Recyclable Waste Association',
      ward_boundary: s.properties?.ward || '',
      epr_statutory_category: EPR_CATEGORIES[1],
      material_sub_type: s.properties?.materialType || 'mixed',
      container_volume_type: s.properties?.container || 'sack',
      fullness_percentage: s.properties?.fullness || 100,
      estimated_weight_kg: s.properties?.estimatedWeight || 0,
      hazard_incident: s.properties?.type === 'hazard_mark',
      incident_type: s.properties?.incidentType || '',
      evidence_photo_local_id: s.properties?.photoId || ''
    }
  }));

  const visitPoints = (visits || []).map(v => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: v.coords ? [parseFloat(v.coords[1]), parseFloat(v.coords[0])] : []
    },
    properties: {
      visit_id: v.visitId,
      timestamp_iso: v.timestamp,
      gps_verified: v.verified,
      feature_type: 'site_visit'
    }
  }));

  const featureCollection = {
    type: 'FeatureCollection',
    metadata: {
      exportedAt: new Date().toISOString(),
      source: 'waste-record',
      toolkit: 'Waste Record',
      visitsLogged: (visits || []).length,
      hazardsTagged: features.length,
      epr_framework: 'Kenya Sustainable Waste Management (EPR) Regulations 2024'
    },
    features: [...features, ...visitPoints]
  };

  const sorted = sortKeys(featureCollection);
  const json = JSON.stringify(sorted, null, 2);
  const hash = await sha256Hex(json);

  featureCollection._integrity = 'sha256-' + hash;
  const blob = new Blob([JSON.stringify(featureCollection, null, 2)], {
    type: 'application/geo+json'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `epr-evidence-${new Date().getTime()}.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
