export const MATERIAL_HEURISTICS = {
  PET: { label: 'PET Plastics', densityKgM3: 21, eprCategory: 'Category 1' },
  HDPE: { label: 'HDPE Plastics', densityKgM3: 14, eprCategory: 'Category 1' },
  CARDBOARD: { label: 'Cardboard', densityKgM3: 45, eprCategory: 'Category 1' },
  PAPER: { label: 'Mixed Paper', densityKgM3: 205, eprCategory: 'Category 1' },
  ALUMINUM: { label: 'Aluminum Cans', densityKgM3: 35.5, eprCategory: 'Category 1' },
  STEEL: { label: 'Steel', densityKgM3: 96.5, eprCategory: 'Category 1' },
  GLASS: { label: 'Glass', densityKgM3: 355.5, eprCategory: 'Category 1' },
  ORGANIC: { label: 'Organic', densityKgM3: 255, eprCategory: 'Category 5' }
};

export const CONTAINER_VOLUMES = {
  GUNIA: { label: 'Sack (100L)', volumeM3: 0.1 },
  MKOKOTENI: { label: 'Cart (1.5m\u00B3)', volumeM3: 1.5 }
};

export function estimateWeight(materialKey, containerKey, fullnessPercent) {
  const material = MATERIAL_HEURISTICS[materialKey];
  const container = CONTAINER_VOLUMES[containerKey];

  if (!material || !container) return 0;

  const volumeUsed = container.volumeM3 * (fullnessPercent / 100);
  const estimatedWeight = volumeUsed * material.densityKgM3;

  return Number(estimatedWeight.toFixed(1));
}
