import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import ParameterSlider from '../../shared/ParameterSlider';
import { autoRegressive, fitAR } from '../../../utils/timeseries';

export default function AutoRegressiveViz() {
  const [order, setOrder] = useState(2);

  const rawData = useMemo(() => {
    const rng = ((seed) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })(77);
    return Array.from({ length: 80 }, (_, i) => ({
      t: i,
      value: 5 + 1.8 * Math.sin(2 * Math.PI * 0.05 * i) + 0.8 * Math.cos(2 * Math.PI * 0.12 * i) + (rng() - 0.5) * 0.6,
    }));
  }, []);

  const coefficients = useMemo(() => fitAR(rawData, order), [rawData, order]);
  const predicted = useMemo(() => autoRegressive(rawData, coefficients), [rawData, coefficients]);

  const chartData = rawData.map((d, i) => ({
    t: d.t,
    original: d.value,
    predicted: predicted[i]?.value ?? null,
  }));

  return (
    <div>
      <div className="controls-panel">
        <ParameterSlider
          label="Order (p)"
          value={order}
          onChange={(v) => setOrder(Math.round(v))}
          min={1}
          max={6}
          step={1}
          description="Number of past values used for prediction"
        />
      </div>

      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: 'rgba(129, 140, 248, 0.5)', name: 'Original Data', strokeWidth: 1.5 },
          { dataKey: 'predicted', color: '#4ade80', name: `AR(${order})`, strokeWidth: 2 },
        ]}
        title={`Autoregressive Model — AR(${order})`}
        height={350}
      />

      {/* Equation Visualization */}
      <motion.div
        key={order}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ marginTop: 'var(--space-lg)' }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          ⚖️ AR({order}) Equation
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          background: 'rgba(0,0,0,0.3)',
          padding: 'var(--space-lg)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          marginBottom: 'var(--space-md)',
          overflowX: 'auto',
        }}>
          <span style={{ color: '#4ade80' }}>ŷ(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> = </span>
          {coefficients.map((c, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: 'var(--text-muted)' }}> + </span>}
              <span style={{ color: '#fbbf24' }}>{c.toFixed(3)}</span>
              <span style={{ color: 'var(--text-secondary)' }}> × y(t-{i + 1})</span>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {coefficients.map((c, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              style={{
                background: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                φ{i + 1}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                {c.toFixed(3)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
