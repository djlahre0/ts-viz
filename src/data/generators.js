/**
 * Synthetic time series data generators.
 * Produces realistic-looking data for demonstrations.
 */

/** Generate a simple sine wave with noise */
export function generateSineWave(length = 100, amplitude = 1, frequency = 0.1, noise = 0.2, offset = 5) {
  return Array.from({ length }, (_, i) => ({
    t: i,
    value: offset + amplitude * Math.sin(2 * Math.PI * frequency * i) + (Math.random() - 0.5) * noise * amplitude,
  }));
}

/** Generate data with a linear trend + seasonality + noise */
export function generateTrendSeasonal(length = 120, trendSlope = 0.05, seasonPeriod = 12, seasonAmplitude = 1, noise = 0.3) {
  return Array.from({ length }, (_, i) => ({
    t: i,
    value:
      2 +
      trendSlope * i +
      seasonAmplitude * Math.sin((2 * Math.PI * i) / seasonPeriod) +
      (Math.random() - 0.5) * noise,
  }));
}

/** Generate random walk (stock-price-like data) */
export function generateRandomWalk(length = 100, start = 100, volatility = 2) {
  const data = [{ t: 0, value: start }];
  for (let i = 1; i < length; i++) {
    data.push({
      t: i,
      value: data[i - 1].value + (Math.random() - 0.5) * volatility,
    });
  }
  return data;
}

/** Generate multi-seasonal data (daily + weekly pattern) */
export function generateMultiSeasonal(length = 168, dailyAmp = 1, weeklyAmp = 2, noise = 0.3) {
  return Array.from({ length }, (_, i) => ({
    t: i,
    value:
      10 +
      dailyAmp * Math.sin((2 * Math.PI * i) / 24) +
      weeklyAmp * Math.sin((2 * Math.PI * i) / 168) +
      0.01 * i +
      (Math.random() - 0.5) * noise,
  }));
}

/** Generate step function with noise (for changepoint detection) */
export function generateStepFunction(length = 100, steps = 3, noise = 0.3) {
  const stepSize = Math.floor(length / (steps + 1));
  let level = 5;
  return Array.from({ length }, (_, i) => {
    if (i > 0 && i % stepSize === 0) {
      level += (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
    }
    return { t: i, value: level + (Math.random() - 0.5) * noise };
  });
}

/** Generate data with both trend and changepoints (Prophet-style) */
export function generateProphetData(length = 365) {
  const changepoints = [90, 200, 300];
  let trend = 0;
  let slope = 0.02;
  return Array.from({ length }, (_, i) => {
    if (changepoints.includes(i)) {
      slope += (Math.random() - 0.5) * 0.04;
    }
    trend += slope;
    const weekly = 0.5 * Math.sin((2 * Math.PI * (i % 7)) / 7);
    const yearly = 1.5 * Math.sin((2 * Math.PI * i) / 365);
    const noise = (Math.random() - 0.5) * 0.4;
    return { t: i, value: 5 + trend + weekly + yearly + noise };
  });
}

/** Common sample dataset — airline passengers style */
export function generateAirlineData(length = 144) {
  return Array.from({ length }, (_, i) => {
    const year = Math.floor(i / 12);
    const month = i % 12;
    const trend = 100 + year * 15;
    const seasonal = 30 * Math.sin((2 * Math.PI * (month - 2)) / 12);
    const noise = (Math.random() - 0.5) * 15;
    return { t: i, value: Math.max(50, trend + seasonal * (1 + year * 0.1) + noise) };
  });
}

/** Seeded random for reproducibility */
export function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Generate reproducible data with seed */
export function generateSeededSine(length = 100, seed = 42) {
  const rng = seededRandom(seed);
  return Array.from({ length }, (_, i) => ({
    t: i,
    value: 5 + 2 * Math.sin(2 * Math.PI * 0.05 * i) + (rng() - 0.5) * 0.8,
  }));
}
