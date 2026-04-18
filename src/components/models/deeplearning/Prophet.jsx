import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import ParameterSlider from '../../shared/ParameterSlider';
import { generateProphetData, seededRandom } from '../../../data/generators';

export default function ProphetViz() {
  const [fourierOrder, setFourierOrder] = useState(6);
  const [changepointPrior, setChangepointPrior] = useState(0.05);

  const rawData = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 200 }, (_, i) => {
      const trend = 0.03 * i + (i > 80 ? 0.02 * (i - 80) : 0) + (i > 150 ? -0.01 * (i - 150) : 0);
      const weekly = 0.8 * Math.sin((2 * Math.PI * (i % 7)) / 7);
      const yearly = 2.0 * Math.sin((2 * Math.PI * i) / 100);
      const noise = (rng() - 0.5) * 0.5;
      const holiday = (i === 50 || i === 100 || i === 160) ? 3 : 0;
      return { t: i, value: 8 + trend + weekly + yearly + noise + holiday };
    });
  }, []);

  // Decompose
  const decomposed = useMemo(() => {
    return rawData.map((d, i) => {
      const trend = 8 + 0.03 * i + (i > 80 ? 0.02 * (i - 80) : 0) + (i > 150 ? -0.01 * (i - 150) : 0);
      const seasonal = 2.0 * Math.sin((2 * Math.PI * i) / 100) + 0.8 * Math.sin((2 * Math.PI * (i % 7)) / 7);
      const holiday = (i === 50 || i === 100 || i === 160) ? 3 : 0;
      return { t: d.t, original: d.value, trend, seasonal, holiday };
    });
  }, [rawData]);

  return (
    <div>
      <div className="controls-panel">
        <ParameterSlider
          label="Fourier Order"
          value={fourierOrder}
          onChange={v => setFourierOrder(Math.round(v))}
          min={1}
          max={15}
          step={1}
          description="Higher = more flexible seasonality"
        />
        <ParameterSlider
          label="Changepoint Prior Scale"
          value={changepointPrior}
          onChange={setChangepointPrior}
          min={0.001}
          max={0.5}
          step={0.001}
          description="Higher = more trend flexibility"
        />
      </div>

      {/* Original + Trend */}
      <TimeSeriesChart
        data={decomposed}
        lines={[
          { dataKey: 'original', color: 'rgba(129, 140, 248, 0.5)', name: 'Original', strokeWidth: 1.5 },
          { dataKey: 'trend', color: '#4ade80', name: 'Trend', strokeWidth: 2.5 },
        ]}
        title="Prophet Decomposition — Original + Trend"
        height={280}
      />

      {/* Components */}
      <div style={{ display: 'grid', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
        <TimeSeriesChart
          data={decomposed}
          lines={[{ dataKey: 'seasonal', color: '#fbbf24', name: 'Seasonality', strokeWidth: 2 }]}
          title="🌊 Seasonality (Weekly + Yearly Fourier)"
          height={160}
        />
        <TimeSeriesChart
          data={decomposed.filter(d => d.holiday > 0).map(d => ({ t: d.t, value: d.holiday }))}
          lines={[{ dataKey: 'value', color: '#f472b6', name: 'Holiday', strokeWidth: 2 }]}
          title="🎄 Holiday Effects"
          height={120}
        />
      </div>

      {/* Equation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
        style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-md)',
        }}>
          <span style={{ color: '#818cf8' }}>y(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> = </span>
          <span style={{ color: '#4ade80' }}>g(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> + </span>
          <span style={{ color: '#fbbf24' }}>s(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> + </span>
          <span style={{ color: '#f472b6' }}>h(t)</span>
          <span style={{ color: 'var(--text-muted)' }}> + </span>
          <span style={{ color: 'var(--text-secondary)' }}>ε(t)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          {[
            { label: 'g(t)', name: 'Trend', color: '#4ade80', desc: 'Piecewise linear/logistic' },
            { label: 's(t)', name: 'Seasonality', color: '#fbbf24', desc: 'Fourier series' },
            { label: 'h(t)', name: 'Holidays', color: '#f472b6', desc: 'Special events' },
            { label: 'ε(t)', name: 'Error', color: 'var(--text-secondary)', desc: 'Random noise' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: `${item.color}08`,
                border: `1px solid ${item.color}25`,
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
