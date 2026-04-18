/**
 * Client-side time series model implementations.
 * These are simplified implementations for educational visualization.
 */

/** Simple Moving Average */
export function movingAverage(data, windowSize = 5) {
  if (windowSize > data.length) return [];
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      result.push({ t: data[i].t, value: null });
    } else {
      let sum = 0;
      for (let j = i - windowSize + 1; j <= i; j++) {
        sum += data[j].value;
      }
      result.push({ t: data[i].t, value: sum / windowSize });
    }
  }
  return result;
}

/** Exponential Smoothing */
export function exponentialSmoothing(data, alpha = 0.3) {
  if (data.length === 0) return [];
  const result = [{ t: data[0].t, value: data[0].value }];
  for (let i = 1; i < data.length; i++) {
    const smoothed = alpha * data[i].value + (1 - alpha) * result[i - 1].value;
    result.push({ t: data[i].t, value: smoothed });
  }
  return result;
}

/** Double Exponential Smoothing (Holt's method) */
export function doubleExponentialSmoothing(data, alpha = 0.3, beta = 0.1) {
  if (data.length < 2) return data;
  let level = data[0].value;
  let trend = data[1].value - data[0].value;
  const result = [{ t: data[0].t, value: level }];

  for (let i = 1; i < data.length; i++) {
    const newLevel = alpha * data[i].value + (1 - alpha) * (level + trend);
    const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
    level = newLevel;
    trend = newTrend;
    result.push({ t: data[i].t, value: level + trend });
  }
  return result;
}

/** Autoregressive model - AR(p) with given coefficients */
export function autoRegressive(data, coefficients = [0.6, 0.3]) {
  const p = coefficients.length;
  if (data.length <= p) return [];
  const result = data.slice(0, p).map(d => ({ t: d.t, value: d.value }));

  for (let i = p; i < data.length; i++) {
    let predicted = 0;
    for (let j = 0; j < p; j++) {
      predicted += coefficients[j] * data[i - j - 1].value;
    }
    result.push({ t: data[i].t, value: predicted });
  }
  return result;
}

/** Fit simple AR coefficients using least squares (for AR(1) and AR(2)) */
export function fitAR(data, order = 1) {
  const n = data.length;
  if (n <= order) return new Array(order).fill(0.5);
  
  // Simple AR(1) fit
  if (order === 1) {
    let sumXY = 0, sumXX = 0;
    for (let i = 1; i < n; i++) {
      sumXY += data[i].value * data[i - 1].value;
      sumXX += data[i - 1].value * data[i - 1].value;
    }
    return [sumXX > 0 ? sumXY / sumXX : 0.5];
  }
  
  // For higher orders, return reasonable defaults
  const coeffs = [];
  let remaining = 0.9;
  for (let i = 0; i < order; i++) {
    const c = remaining * 0.6;
    coeffs.push(c);
    remaining -= c;
  }
  return coeffs;
}

/** Simple differencing for ARIMA's "I" part */
export function difference(data, d = 1) {
  if (d === 0) return data;
  let result = data;
  for (let iter = 0; iter < d; iter++) {
    const newResult = [];
    for (let i = 1; i < result.length; i++) {
      newResult.push({
        t: result[i].t,
        value: result[i].value - result[i - 1].value,
      });
    }
    result = newResult;
  }
  return result;
}

/** Inverse differencing (reconstruct from differenced) */
export function inverseDifference(diffData, originalFirst) {
  const result = [{ t: diffData[0].t - 1, value: originalFirst }];
  for (let i = 0; i < diffData.length; i++) {
    result.push({
      t: diffData[i].t,
      value: result[result.length - 1].value + diffData[i].value,
    });
  }
  return result;
}

/** Simplified ARIMA(p,d,q) forecast */
export function arimaForecast(data, p = 1, d = 1, q = 0, forecastSteps = 10) {
  // Difference the data
  const diffed = difference(data, d);
  
  // Fit AR on differenced data
  const coeffs = fitAR(diffed, p);
  
  // Generate forecast on differenced data
  const extended = [...diffed.map(x => x.value)];
  for (let step = 0; step < forecastSteps; step++) {
    let predicted = 0;
    for (let j = 0; j < p; j++) {
      predicted += coeffs[j] * (extended[extended.length - j - 1] || 0);
    }
    extended.push(predicted);
  }
  
  // Inverse difference to get actual values
  const forecastDiff = extended.slice(diffed.length);
  let lastValue = data[data.length - 1].value;
  const forecast = [];
  for (let i = 0; i < forecastSteps; i++) {
    lastValue += forecastDiff[i];
    forecast.push({
      t: data.length + i,
      value: lastValue,
    });
  }
  
  return forecast;
}

/** Seasonal decomposition (additive) */
export function seasonalDecompose(data, period = 12) {
  const n = data.length;
  const values = data.map(d => d.value);
  
  // Trend: centered moving average
  const trend = [];
  const halfP = Math.floor(period / 2);
  for (let i = 0; i < n; i++) {
    if (i < halfP || i >= n - halfP) {
      trend.push(null);
    } else {
      let sum = 0;
      for (let j = i - halfP; j <= i + halfP; j++) {
        sum += values[j];
      }
      trend.push(sum / (period + 1));
    }
  }
  
  // Seasonal: average the detrended values for each position in the cycle
  const seasonal = new Array(period).fill(0);
  const counts = new Array(period).fill(0);
  for (let i = 0; i < n; i++) {
    if (trend[i] !== null) {
      seasonal[i % period] += values[i] - trend[i];
      counts[i % period]++;
    }
  }
  for (let p = 0; p < period; p++) {
    if (counts[p] > 0) seasonal[p] /= counts[p];
  }
  
  // Residual
  return data.map((d, i) => ({
    t: d.t,
    original: d.value,
    trend: trend[i],
    seasonal: seasonal[i % period],
    residual: trend[i] !== null ? d.value - trend[i] - seasonal[i % period] : null,
  }));
}

/** Generate probabilistic forecast (DeepAR style) */
export function probabilisticForecast(data, forecastSteps = 20, spreadFactor = 1) {
  const lastVal = data[data.length - 1].value;
  const recentTrend = data.length > 5
    ? (data[data.length - 1].value - data[data.length - 5].value) / 5
    : 0;

  return Array.from({ length: forecastSteps }, (_, i) => {
    const step = i + 1;
    const mean = lastVal + recentTrend * step;
    const uncertainty = spreadFactor * Math.sqrt(step) * 0.5;
    return {
      t: data.length + i,
      mean,
      upper90: mean + 1.645 * uncertainty,
      lower90: mean - 1.645 * uncertainty,
      upper50: mean + 0.674 * uncertainty,
      lower50: mean - 0.674 * uncertainty,
    };
  });
}

/**
 * Simulate attention scores for Transformer visualization.
 * Creates a matrix of attention weights.
 */
export function simulateAttention(length = 10) {
  const matrix = [];
  for (let i = 0; i < length; i++) {
    const row = [];
    let sum = 0;
    for (let j = 0; j < length; j++) {
      // Attention tends to be stronger for nearby positions and at boundaries
      const dist = Math.abs(i - j);
      const raw = Math.exp(-dist * 0.3) + (j === 0 || j === length - 1 ? 0.3 : 0) + Math.random() * 0.2;
      row.push(raw);
      sum += raw;
    }
    // Normalize (softmax-like)
    matrix.push(row.map(v => v / sum));
  }
  return matrix;
}
