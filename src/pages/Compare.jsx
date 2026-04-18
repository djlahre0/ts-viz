import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../components/shared/TimeSeriesChart';
import ParameterSlider from '../components/shared/ParameterSlider';
import { MODELS, ERA_LABELS } from '../data/models';
import { generateSeededSine } from '../data/generators';
import { movingAverage, exponentialSmoothing, autoRegressive, fitAR } from '../utils/timeseries';
import { GitCompare } from 'lucide-react';

const COMPARABLE_MODELS = [
  { id: 'moving-average', name: 'Moving Average' },
  { id: 'exponential-smoothing', name: 'Exponential Smoothing' },
  { id: 'autoregressive', name: 'Autoregressive (AR)' },
];

export default function Compare() {
  const [modelA, setModelA] = useState('moving-average');
  const [modelB, setModelB] = useState('exponential-smoothing');
  const [windowSize, setWindowSize] = useState(5);
  const [alpha, setAlpha] = useState(0.3);
  const [arOrder, setArOrder] = useState(2);

  const rawData = useMemo(() => generateSeededSine(80, 42), []);

  const getModelOutput = (modelId) => {
    switch (modelId) {
      case 'moving-average':
        return movingAverage(rawData, windowSize);
      case 'exponential-smoothing':
        return exponentialSmoothing(rawData, alpha);
      case 'autoregressive':
        const coeffs = fitAR(rawData, arOrder);
        return autoRegressive(rawData, coeffs);
      default:
        return [];
    }
  };

  const outputA = useMemo(() => getModelOutput(modelA), [modelA, rawData, windowSize, alpha, arOrder]);
  const outputB = useMemo(() => getModelOutput(modelB), [modelB, rawData, windowSize, alpha, arOrder]);

  const chartData = rawData.map((d, i) => ({
    t: d.t,
    original: d.value,
    modelA: outputA[i]?.value ?? null,
    modelB: outputB[i]?.value ?? null,
  }));

  // Compute error metrics
  const computeMetrics = (predicted) => {
    let mae = 0, mse = 0, count = 0;
    for (let i = 0; i < rawData.length; i++) {
      if (predicted[i]?.value != null) {
        const err = Math.abs(rawData[i].value - predicted[i].value);
        mae += err;
        mse += err * err;
        count++;
      }
    }
    return count > 0 ? { mae: mae / count, rmse: Math.sqrt(mse / count) } : { mae: 0, rmse: 0 };
  };

  const metricsA = useMemo(() => computeMetrics(outputA), [outputA, rawData]);
  const metricsB = useMemo(() => computeMetrics(outputB), [outputB, rawData]);

  const nameA = COMPARABLE_MODELS.find(m => m.id === modelA)?.name || modelA;
  const nameB = COMPARABLE_MODELS.find(m => m.id === modelB)?.name || modelB;

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 'var(--space-sm)',
        }}>
          <GitCompare size={28} style={{ display: 'inline', marginRight: '8px' }} />
          Compare Models
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          Compare classical time series models side-by-side on the same data.
        </p>
      </motion.div>

      {/* Model Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-sm)' }}>
            Model A
          </label>
          <select
            className="compare-select"
            value={modelA}
            onChange={e => setModelA(e.target.value)}
            style={{ borderColor: '#4ade80' }}
          >
            {COMPARABLE_MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-sm)' }}>
            Model B
          </label>
          <select
            className="compare-select"
            value={modelB}
            onChange={e => setModelB(e.target.value)}
            style={{ borderColor: '#f472b6' }}
          >
            {COMPARABLE_MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-panel">
        <ParameterSlider
          label="MA Window Size"
          value={windowSize}
          onChange={setWindowSize}
          min={2}
          max={20}
          step={1}
        />
        <ParameterSlider
          label="ES Alpha (α)"
          value={alpha}
          onChange={setAlpha}
          min={0.01}
          max={0.99}
          step={0.01}
        />
        <ParameterSlider
          label="AR Order (p)"
          value={arOrder}
          onChange={v => setArOrder(Math.round(v))}
          min={1}
          max={5}
          step={1}
        />
      </div>

      {/* Chart */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <TimeSeriesChart
          data={chartData}
          lines={[
            { dataKey: 'original', color: 'rgba(129, 140, 248, 0.3)', name: 'Original Data', strokeWidth: 1.5 },
            { dataKey: 'modelA', color: '#4ade80', name: nameA, strokeWidth: 2.5 },
            { dataKey: 'modelB', color: '#f472b6', name: nameB, strokeWidth: 2.5 },
          ]}
          title="Side-by-Side Comparison"
          height={380}
        />
      </div>

      {/* Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-lg)',
        marginTop: 'var(--space-xl)',
      }}>
        {[
          { name: nameA, metrics: metricsA, color: '#4ade80' },
          { name: nameB, metrics: metricsB, color: '#f472b6' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
            style={{ borderColor: `${m.color}30` }}
          >
            <div style={{ fontWeight: 700, color: m.color, marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
              {m.name}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  MAE
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {m.metrics.mae.toFixed(4)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  RMSE
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {m.metrics.rmse.toFixed(4)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
