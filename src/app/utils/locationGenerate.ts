//🌍
const EARTH_RADIUS = 6371;

export const randomLocationWithinRadius = (
  center: [number, number],
  radiusKm: number
): [number, number] => {
  const [lng, lat] = center;
  const r = radiusKm / EARTH_RADIUS;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;

  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(w) +
      Math.cos(latRad) * Math.sin(w) * Math.cos(t)
  );

  const newLngRad =
    lngRad +
    Math.atan2(
      Math.sin(t) * Math.sin(w) * Math.cos(latRad),
      Math.cos(w) - Math.sin(latRad) * Math.sin(newLatRad)
    );

  return [(newLngRad * 180) / Math.PI, (newLatRad * 180) / Math.PI];
};
