async function stampPhoto(blob, timestamp, lat, lng) {
  const img = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  img.close();

  const barHeight = Math.max(28, Math.round(canvas.height / 22));
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
  ctx.fillStyle = '#ffffff';
  const fontSize = Math.max(10, Math.round(canvas.width / 55));
  ctx.font = fontSize + 'px monospace';
  ctx.textBaseline = 'middle';

  const d = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());

  ctx.textAlign = 'left';
  ctx.fillText('Waste Record ' + dateStr, 8, canvas.height - barHeight / 2);

  if (lat !== undefined && lng !== undefined) {
    ctx.textAlign = 'right';
    ctx.fillText(lat.toFixed(5) + ', ' + lng.toFixed(5), canvas.width - 8, canvas.height - barHeight / 2);
  }

  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
  });
}

export { stampPhoto };
