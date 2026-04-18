import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import ParameterSlider from '../../shared/ParameterSlider';
import { generateTrendSeasonal } from '../../../data/generators';
import { difference, arimaForecast, movingAverage } from '../../../utils/timeseries';

export default function ARIMAViz() {
  const [p, setP] = useState(1);
  const [d, setD] = useState(1);
  const [forecastSteps, setForecastSteps] = useState(15);

  const rawData = useMemo(() => {
    const rng = ((seed) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })(55);
    return Array.from({ length: 80 }, (_, i) => ({
      t: i,
      value: 3 + 0.05 * i + 1.5 * Math.sin(2 * Math.PI * 0.06 * i) + (rng() - 0.5) * 0.6,
    }));
  }, []);

  const diffedData = useMemo(() => difference(rawData, d), [rawData, d]);
  const forecast = useMemo(() => arimaForecast(rawData, p, d, 0, forecastSteps), [rawData, p, d, forecastSteps]);

  // chart data — original + forecast
  const chartData = useMemo(() => {
    const result = rawData.map(d => ({
      t: d.t,
      original: d.value,
      forecast: null,
    }));
    forecast.forEach(f => {
      result.push({ t: f.t, original: null, forecast: f.value });
    });
    // Connect last original to first forecast
    if (result.length > rawData.length && rawData.length > 0) {
      result[rawData.length - 1].forecast = result[rawData.length - 1].original;
    }
    return result;
  }, [rawData, forecast]);

  // Differenced data chart
  const diffChartData = diffedData.map(d => ({
    t: d.t,
    value: d.value,
  }));

  return (
    <div>
      <div className="controls-panel">
        <ParameterSlider
          label="p (AR order)"
          value={p}
          onChange={v => setP(Math.round(v))}
          min={0}
          max={4}
          step={1}
          description="Autoregressive terms"
        />
        <ParameterSlider
          label="d (Differencing)"
          value={d}
          onChange={v => setD(Math.round(v))}
          min={0}
          max={2}
          step={1}
          description="Number of times to difference"
        />
        <ParameterSlider
          label="Forecast Steps"
          value={forecastSteps}
          onChange={v => setForecastSteps(Math.round(v))}
          min={5}
          max={30}
          step={1}
          description="Steps to forecast ahead"
        />
      </div>

      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: '#818cf8', name: 'Original Data', strokeWidth: 2 },
          { dataKey: 'forecast', color: '#fbbf24', name: `ARIMA(${p},${d},0) Forecast`, strokeWidth: 2, dashArray: '6 3' },
        ]}
        title={`ARIMA(${p},${d},0) — Original + Forecast`}
        height={320}
        referenceLine={{ x: rawData.length - 1, label: 'Forecast →', color: 'rgba(251, 191, 36, 0.4)' }}
      />

      {/* Differenced Data */}
      {d > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 'var(--space-lg)' }}
        >
          <TimeSeriesChart
            data={diffChartData}
            lines={[
              { dataKey: 'value', color: '#34d399', name: `Differenced (d=${d})`, strokeWidth: 1.5 },
            ]}
            title={`After ${d}× Differencing — Stationary Data`}
            height={200}
          />
        </motion.div>
      )}

      {/* ARIMA Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ marginTop: 'var(--space-lg)' }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          🔧 ARIMA Pipeline
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Raw Data', sub: 'Non-stationary', color: '#818cf8', icon: '📊' },
            { label: '→', sub: '', color: 'var(--text-muted)', icon: '' },
            { label: `Difference (d=${d})`, sub: 'Make stationary', color: '#34d399', icon: '📐' },
            { label: '→', sub: '', color: 'var(--text-muted)', icon: '' },
            { label: `AR(${p})`, sub: 'Predict from lags', color: '#fbbf24', icon: '🔙' },
            { label: '→', sub: '', color: 'var(--text-muted)', icon: '' },
            { label: 'Inverse Diff', sub: 'Reconstruct', color: '#f472b6', icon: '🔄' },
            { label: '→', sub: '', color: 'var(--text-muted)', icon: '' },
            { label: 'Forecast', sub: 'Final output', color: '#fbbf24', icon: '🎯' },
          ].map((step, i) => (
            step.icon ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: `${step.color}10`,
                  border: `1px solid ${step.color}30`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: '100px',
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{step.icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: step.color }}>{step.label}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{step.sub}</div>
              </motion.div>
            ) : (
              <div key={i} style={{ fontSize: '1.2rem', color: step.color }}>→</div>
            )
          ))}
        </div>
      </motion.div>
    </div>
  );
}
