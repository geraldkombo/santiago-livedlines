export const generateAuditExport = (strokes, ledgerData) => {
  const featureCollection = {
    type: "FeatureCollection",
    metadata: {
      exportedAt: new Date().toISOString(),
      source: "santiago-livedlines",
      ledgerSummary: ledgerData
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
  a.download = `audit_export_${new Date().getTime()}.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
