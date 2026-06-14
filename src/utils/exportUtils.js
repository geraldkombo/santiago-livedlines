export const generateAuditExport = (strokes, ledgerData) => {
  const featureCollection = {
    type: "FeatureCollection",
    metadata: {
      exportedAt: new Date().toISOString(),
      source: "picket",
      toolkit: "Waste Picker Spatial Organizing Toolkit",
      visitsLogged: Object.keys(ledgerData).length || (ledgerData.length || 0)
    },
    features: strokes.map(stroke => ({
      ...stroke,
      properties: {
        ...stroke.properties,
        exported: true
      }
    }))
  };

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
