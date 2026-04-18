import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import ParameterSlider from '../../shared/ParameterSlider';
import { generateSeededSine } from '../../../data/generators';
import { exponentialSmoothing } from '../../../utils/timeseries';

export default function ExponentialSmoothingViz() {
  const [alpha, setAlpha] = useState(0.3);
  const [noise, setNoise] = useState(0.8);

  const rawData = useMemo(() => {
    const rng = ((seed) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })(123);
    return Array.from({ length: 80 }, (_, i) => ({
      t: i,
      value: 5 + 2 * Math.sin(2 * Math.PI * 0.04 * i) + (rng() - 0.5) * noise * 2,
    }));
  }, [noise]);

  const smoothed = useMemo(() => exponentialSmoothing(rawData, alpha), [rawData, alpha]);

  const chartData = rawData.map((d, i) => ({
    t: d.t,
    original: d.value,
    smoothed: smoothed[i]?.value ?? null,
  }));

  // Weight visualization
  const weights = useMemo(() => {
    const n = 10;
    return Array.from({ length: n }, (_, i) => ({
      lag: i,
      weight: alpha * Math.pow(1 - alpha, i),
    }));
  }, [alpha]);

  return (
    <div>
      <div className="controls-panel">
        <ParameterSlider
          label="Alpha (α)"
          value={alpha}
          onChange={setAlpha}
          min={0.01}
          max={0.99}
          step={0.01}
          description="Smoothing factor — higher = more responsive"
        />
        <ParameterSlider
          label="Noise Level"
          value={noise}
          onChange={setNoise}
          min={0.1}
          max={2}
          step={0.1}
          description="Random noise amplitude"
        />
      </div>

      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: 'rgba(129, 140, 248, 0.4)', name: 'Original Data', strokeWidth: 1.5 },
          { dataKey: 'smoothed', color: '#4ade80', name: `ES(α=${alpha.toFixed(2)})`, strokeWidth: 2.5 },
        ]}
        title="Exponential Smoothing"
        height={350}
      />

      {/* Weight Decay Visualization */}
      <motion.div
        key={alpha}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ marginTop: 'var(--space-lg)' }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          📉 Exponential Weight Decay (α = {alpha.toFixed(2)})
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '6px',
          marginBottom: 'var(--space-md)',
          height: '120px',
          padding: '0 4px',
        }}>
          {weights.map((w, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transformOrigin: 'bottom',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {(w.weight * 100).toFixed(1)}%
              </span>
              <div style={{
                width: '100%',
                height: `${Math.max(4, w.weight * 250)}px`,
                background: `linear-gradient(to top, rgba(74, 222, 128, ${0.3 + w.weight}), rgba(74, 222, 128, ${w.weight * 0.5}))`,
                borderRadius: '4px 4px 0 0',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderBottom: 'none',
              }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                t-{i}
              </span>
            </motion.div>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Weight formula: α × (1-α)ⁱ — Each bar shows how much past data point t-i contributes to the current smoothed value.
          {alpha > 0.5
            ? ' High α: recent data dominates → more responsive, less smooth.'
            : ' Low α: weights decay slowly → smoother but more lagged.'}
        </div>
      </motion.div>
    </div>
  );
}
