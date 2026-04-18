import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import { generateTrendSeasonal, seededRandom } from '../../../data/generators';
import { probabilisticForecast } from '../../../utils/timeseries';

export default function TFTViz() {
  const rawData = useMemo(() => generateTrendSeasonal(80, 0.04, 12, 1.5, 0.3), []);

  const forecast = useMemo(() => probabilisticForecast(rawData, 20, 1.5), [rawData]);

  const chartData = useMemo(() => {
    const result = rawData.map(d => ({
      t: d.t, original: d.value, mean: null, upper90: null, lower90: null,
    }));
    const lastPt = rawData[rawData.length - 1];
    result[result.length - 1].mean = lastPt.value;
    result[result.length - 1].upper90 = lastPt.value;
    result[result.length - 1].lower90 = lastPt.value;
    forecast.forEach(f => {
      result.push({ t: f.t, original: null, mean: f.mean, upper90: f.upper90, lower90: f.lower90 });
    });
    return result;
  }, [rawData, forecast]);

  // Variable importance simulation
  const variables = [
    { name: 'Lag 1', importance: 0.28, color: '#818cf8' },
    { name: 'Trend', importance: 0.22, color: '#4ade80' },
    { name: 'Lag 12', importance: 0.18, color: '#fbbf24' },
    { name: 'Hour', importance: 0.12, color: '#f472b6' },
    { name: 'DayOfWeek', importance: 0.10, color: '#60a5fa' },
    { name: 'Rolling Mean', importance: 0.06, color: '#a78bfa' },
    { name: 'External', importance: 0.04, color: '#34d399' },
  ];

  // Attention over time
  const attentionWeights = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 20 }, (_, i) => {
      const decay = Math.exp(-i * 0.15);
      return { t: rawData.length - 20 + i, weight: decay + (rng() - 0.5) * 0.1 };
    });
  }, [rawData]);

  return (
    <div>
      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: '#818cf8', name: 'Historical', strokeWidth: 2 },
          { dataKey: 'mean', color: '#fbbf24', name: 'TFT Forecast', strokeWidth: 2, dashArray: '6 3' },
          { dataKey: 'upper90', color: 'rgba(251, 191, 36, 0.3)', name: '90% Upper', strokeWidth: 1 },
          { dataKey: 'lower90', color: 'rgba(251, 191, 36, 0.3)', name: '90% Lower', strokeWidth: 1 },
        ]}
        title="TFT Multi-Horizon Forecast with Uncertainty"
        height={300}
        referenceLine={{ x: rawData.length - 1, label: 'Forecast →', color: 'rgba(251, 191, 36, 0.4)' }}
      />

      {/* Variable Importance */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          🎯 Variable Selection Network — Feature Importance
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {variables.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                width: '90px',
                textAlign: 'right',
              }}>
                {v.name}
              </div>
              <div style={{
                flex: 1,
                height: '24px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${v.importance * 100 * 3}%` }}
                  transition={{ delay: i * 0.06 + 0.3, duration: 0.5, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${v.color}40, ${v.color}80)`,
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '8px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'white', fontWeight: 600 }}>
                    {(v.importance * 100).toFixed(0)}%
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
          TFT's Variable Selection Network learns which features are most important — a key advantage over black-box models.
        </div>
      </div>

      {/* Architecture */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          🏗️ TFT Architecture Pipeline
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: 'var(--space-md)',
        }}>
          {[
            { label: 'Variable Selection Networks', color: '#60a5fa', desc: 'Select important features' },
            { label: 'LSTM Encoder-Decoder', color: '#a78bfa', desc: 'Capture local temporal patterns' },
            { label: 'Interpretable Multi-Head Attention', color: '#f472b6', desc: 'Global temporal relationships' },
            { label: 'Quantile Output Layer', color: '#4ade80', desc: 'Predict 10th, 50th, 90th percentiles' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <div style={{
                padding: '12px 16px',
                background: `${step.color}08`,
                border: `1px solid ${step.color}25`,
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: step.color }}>{step.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{step.desc}</div>
              </div>
              {i < 3 && (
                <div style={{ width: '2px', height: '6px', background: 'rgba(255,255,255,0.1)', margin: '0 auto' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
