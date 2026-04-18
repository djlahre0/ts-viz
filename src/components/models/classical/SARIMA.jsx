import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import ParameterSlider from '../../shared/ParameterSlider';
import { seasonalDecompose } from '../../../utils/timeseries';

export default function SARIMAViz() {
  const [seasonPeriod, setSeasonPeriod] = useState(12);

  const rawData = useMemo(() => {
    const rng = ((seed) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })(88);
    return Array.from({ length: 120 }, (_, i) => {
      const year = Math.floor(i / 12);
      const month = i % 12;
      const trend = 100 + year * 12;
      const seasonal = 25 * Math.sin((2 * Math.PI * (month - 2)) / 12);
      const noise = (rng() - 0.5) * 10;
      return { t: i, value: trend + seasonal * (1 + year * 0.08) + noise };
    });
  }, []);

  const decomposition = useMemo(() => seasonalDecompose(rawData, seasonPeriod), [rawData, seasonPeriod]);

  const originalChart = decomposition.map(d => ({ t: d.t, value: d.original }));
  const trendChart = decomposition.filter(d => d.trend !== null).map(d => ({ t: d.t, value: d.trend }));
  const seasonalChart = decomposition.map(d => ({ t: d.t, value: d.seasonal }));
  const residualChart = decomposition.filter(d => d.residual !== null).map(d => ({ t: d.t, value: d.residual }));

  return (
    <div>
      <div className="controls-panel">
        <ParameterSlider
          label="Seasonal Period (S)"
          value={seasonPeriod}
          onChange={v => setSeasonPeriod(Math.round(v))}
          min={4}
          max={24}
          step={1}
          description="Length of seasonal cycle"
        />
      </div>

      <TimeSeriesChart
        data={originalChart}
        lines={[{ dataKey: 'value', color: '#818cf8', name: 'Original', strokeWidth: 2 }]}
        title="Original Time Series (Airline-style Data)"
        height={250}
      />

      <div style={{ marginTop: 'var(--space-lg)', display: 'grid', gap: 'var(--space-md)' }}>
        <TimeSeriesChart
          data={trendChart}
          lines={[{ dataKey: 'value', color: '#4ade80', name: 'Trend', strokeWidth: 2 }]}
          title="📈 Extracted Trend"
          height={160}
        />
        <TimeSeriesChart
          data={seasonalChart}
          lines={[{ dataKey: 'value', color: '#fbbf24', name: 'Seasonal', strokeWidth: 2 }]}
          title="🌊 Seasonal Component"
          height={160}
        />
        <TimeSeriesChart
          data={residualChart}
          lines={[{ dataKey: 'value', color: '#f472b6', name: 'Residual', strokeWidth: 1.5 }]}
          title="🎲 Residual (Noise)"
          height={160}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
        style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text-primary)' }}>
          <span style={{ color: '#818cf8' }}>y(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> = </span>
          <span style={{ color: '#4ade80' }}>Trend(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> + </span>
          <span style={{ color: '#fbbf24' }}>Seasonal(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> + </span>
          <span style={{ color: '#f472b6' }}>Residual(t)</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          SARIMA adds seasonal AR, differencing, and MA terms (P, D, Q) at lag S={seasonPeriod} to capture these repeating patterns.
        </div>
      </motion.div>
    </div>
  );
}
