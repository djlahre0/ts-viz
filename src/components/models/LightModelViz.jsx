import { useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../shared/TimeSeriesChart';
import { generateSeededSine, generateTrendSeasonal, generateRandomWalk } from '../../data/generators';
import { probabilisticForecast } from '../../utils/timeseries';

/**
 * Generic light visualization component for models that don't need
 * a custom implementation. Shows chart + architecture concept + data flow.
 */
export default function LightModelViz({ modelId }) {
  const config = MODEL_VIZ_CONFIG[modelId];

  const data = useMemo(() => {
    if (!config) return [];
    return config.generateData();
  }, [modelId]);

  const chartData = useMemo(() => {
    if (!config || data.length === 0) return [];

    if (config.showProbabilistic) {
      const forecast = probabilisticForecast(data, 20, 1.2);
      const result = data.map(d => ({
        t: d.t, original: d.value, mean: null, upper90: null, lower90: null, upper50: null, lower50: null,
      }));
      // Connect last point
      const lastPt = data[data.length - 1];
      result[result.length - 1].mean = lastPt.value;
      result[result.length - 1].upper90 = lastPt.value;
      result[result.length - 1].lower90 = lastPt.value;
      result[result.length - 1].upper50 = lastPt.value;
      result[result.length - 1].lower50 = lastPt.value;
      forecast.forEach(f => {
        result.push({ t: f.t, original: null, ...f });
      });
      return result;
    }

    return data.map((d, i) => {
      const predicted = i > 5 ? config.predict(data, i) : null;
      return { t: d.t, original: d.value, predicted };
    });
  }, [data, modelId]);

  if (!config) return <div style={{ color: 'var(--text-muted)' }}>Visualization coming soon...</div>;

  const lines = config.showProbabilistic
    ? [
        { dataKey: 'original', color: '#818cf8', name: 'Historical', strokeWidth: 2 },
        { dataKey: 'mean', color: '#fbbf24', name: 'Forecast', strokeWidth: 2, dashArray: '6 3' },
      ]
    : [
        { dataKey: 'original', color: '#818cf8', name: 'Original', strokeWidth: 2 },
        { dataKey: 'predicted', color: config.color || '#4ade80', name: config.predLabel || 'Predicted', strokeWidth: 2 },
      ];

  const areas = config.showProbabilistic
    ? [
        { dataKey: 'upper90', color: 'rgba(251, 191, 36, 0.1)', name: '90% CI Upper', strokeWidth: 0 },
        { dataKey: 'lower90', color: 'rgba(251, 191, 36, 0.05)', name: '90% CI Lower', strokeWidth: 0 },
        { dataKey: 'upper50', color: 'rgba(251, 191, 36, 0.15)', name: '50% CI Upper', strokeWidth: 0 },
        { dataKey: 'lower50', color: 'rgba(251, 191, 36, 0.08)', name: '50% CI Lower', strokeWidth: 0 },
      ]
    : [];

  return (
    <div>
      <TimeSeriesChart
        data={chartData}
        lines={lines}
        areas={areas}
        title={config.chartTitle}
        height={320}
      />

      {/* Architecture / Concept Diagram */}
      {config.architectureSteps && (
        <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
            {config.diagramTitle || '🏗️ Architecture Overview'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: 'var(--space-md)',
          }}>
            {config.architectureSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {step.isArrow ? (
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>→</span>
                ) : (
                  <div style={{
                    background: `${step.color}10`,
                    border: `1px solid ${step.color}30`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    textAlign: 'center',
                    minWidth: '80px',
                  }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{step.icon}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: step.color }}>{step.label}</div>
                    {step.sub && <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{step.sub}</div>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MODEL_VIZ_CONFIG = {
  'svr': {
    generateData: () => generateSeededSine(50, 33),
    predict: (data, i) => data[i].value * 0.93 + 0.35,
    chartTitle: 'SVR — Support Vector Regression',
    predLabel: 'SVR Fit',
    color: '#60a5fa',
    diagramTitle: '📦 SVR Concept',
    architectureSteps: [
      { label: 'Input', sub: 'Lag features', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Kernel', sub: 'Map to higher dim', color: '#a78bfa', icon: '🔮' },
      { isArrow: true },
      { label: 'ε-Tube', sub: 'Fit within margin', color: '#fbbf24', icon: '📦' },
      { isArrow: true },
      { label: 'Predict', sub: 'Output value', color: '#4ade80', icon: '🎯' },
    ],
  },
  'random-forest': {
    generateData: () => generateSeededSine(50, 44),
    predict: (data, i) => data[i].value * 0.96 + (Math.sin(i * 0.5) * 0.08),
    chartTitle: 'Random Forest — Ensemble Prediction',
    predLabel: 'RF Predicted',
    color: '#4ade80',
    diagramTitle: '🌲 Random Forest Ensemble',
    architectureSteps: [
      { label: 'Features', sub: 'Lag + rolling stats', color: '#60a5fa', icon: '🏗️' },
      { isArrow: true },
      { label: 'Tree 1', sub: 'Random subset', color: '#4ade80', icon: '🌲' },
      { label: 'Tree 2', sub: 'Random subset', color: '#4ade80', icon: '🌲' },
      { label: 'Tree N', sub: 'Random subset', color: '#4ade80', icon: '🌲' },
      { isArrow: true },
      { label: 'Average', sub: 'Final prediction', color: '#fbbf24', icon: '📊' },
    ],
  },
  'gru': {
    generateData: () => generateSeededSine(60, 66),
    predict: (data, i) => data[i].value * 0.94 + (Math.sin(i * 0.15) * 0.12),
    chartTitle: 'GRU — Gated Recurrent Unit',
    predLabel: 'GRU Predicted',
    color: '#a78bfa',
    diagramTitle: '🔄 GRU Cell (Simplified LSTM)',
    architectureSteps: [
      { label: 'x(t)', sub: 'Input', color: '#60a5fa', icon: '📥' },
      { isArrow: true },
      { label: 'Update Gate', sub: 'z(t) = σ(...)', color: '#fbbf24', icon: '🔄' },
      { label: 'Reset Gate', sub: 'r(t) = σ(...)', color: '#f472b6', icon: '🔃' },
      { isArrow: true },
      { label: 'h(t)', sub: 'Hidden state', color: '#a78bfa', icon: '🧠' },
      { isArrow: true },
      { label: 'ŷ(t)', sub: 'Output', color: '#4ade80', icon: '📤' },
    ],
  },
  'seq2seq': {
    generateData: () => generateSeededSine(50, 77),
    predict: (data, i) => data[i].value * 0.91 + 0.45,
    chartTitle: 'Seq2Seq — Encoder-Decoder',
    predLabel: 'Seq2Seq Output',
    color: '#f472b6',
    diagramTitle: '📖 Encoder-Decoder Architecture',
    architectureSteps: [
      { label: 'x(1..T)', sub: 'Input sequence', color: '#60a5fa', icon: '📖' },
      { isArrow: true },
      { label: 'Encoder', sub: 'LSTM / GRU', color: '#a78bfa', icon: '🔐' },
      { isArrow: true },
      { label: 'Context', sub: 'Fixed-length vector', color: '#fbbf24', icon: '🎯' },
      { isArrow: true },
      { label: 'Decoder', sub: 'LSTM / GRU', color: '#f472b6', icon: '🔓' },
      { isArrow: true },
      { label: 'ŷ(1..H)', sub: 'Output sequence', color: '#4ade80', icon: '✍️' },
    ],
  },
  'wavenet': {
    generateData: () => generateSeededSine(60, 88),
    predict: (data, i) => data[i].value * 0.97 + (Math.cos(i * 0.3) * 0.05),
    chartTitle: 'WaveNet — Dilated Causal Convolutions',
    predLabel: 'WaveNet Output',
    color: '#a78bfa',
    diagramTitle: '🔭 Dilated Convolution Layers',
    architectureSteps: [
      { label: 'Input', sub: 'Raw sequence', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Dilation=1', sub: 'Receptive: 2', color: '#a78bfa', icon: '◀️' },
      { isArrow: true },
      { label: 'Dilation=2', sub: 'Receptive: 4', color: '#a78bfa', icon: '◀◀' },
      { isArrow: true },
      { label: 'Dilation=4', sub: 'Receptive: 8', color: '#a78bfa', icon: '◀◀◀' },
      { isArrow: true },
      { label: 'Output', sub: 'Prediction', color: '#4ade80', icon: '🎯' },
    ],
  },
  'deepar': {
    generateData: () => generateSeededSine(60, 22),
    showProbabilistic: true,
    chartTitle: 'DeepAR — Probabilistic Forecast',
    diagramTitle: '🎲 Probabilistic Autoregressive Flow',
    architectureSteps: [
      { label: 'x(1..T)', sub: 'History', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'LSTM', sub: 'Encode context', color: '#a78bfa', icon: '🧠' },
      { isArrow: true },
      { label: 'μ, σ', sub: 'Distribution params', color: '#fbbf24', icon: '🎲' },
      { isArrow: true },
      { label: 'Sample', sub: 'Next value', color: '#f472b6', icon: '🎯' },
      { isArrow: true },
      { label: 'Intervals', sub: '50% / 90% CI', color: '#4ade80', icon: '📊' },
    ],
  },
  'nbeats': {
    generateData: () => generateTrendSeasonal(80, 0.03, 12, 1, 0.2),
    predict: (data, i) => data[i].value * 0.98 + 0.05,
    chartTitle: 'N-BEATS — Neural Basis Expansion',
    predLabel: 'N-BEATS Fit',
    color: '#a78bfa',
    diagramTitle: '🧱 Stacked Block Architecture',
    architectureSteps: [
      { label: 'Input', sub: 'Lookback window', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Block 1', sub: 'FC layers', color: '#a78bfa', icon: '🧱' },
      { isArrow: true },
      { label: 'Block 2', sub: 'Residual input', color: '#a78bfa', icon: '🧱' },
      { isArrow: true },
      { label: 'Block N', sub: 'Residual input', color: '#a78bfa', icon: '🧱' },
      { isArrow: true },
      { label: 'Sum', sub: 'All forecasts', color: '#4ade80', icon: '📊' },
    ],
  },
  'patchtst': {
    generateData: () => generateSeededSine(60, 111),
    predict: (data, i) => data[i].value * 0.96 + 0.2,
    chartTitle: 'PatchTST — Patch + Transformer',
    predLabel: 'PatchTST Output',
    color: '#f472b6',
    diagramTitle: '🧩 Patching Pipeline',
    architectureSteps: [
      { label: 'Series', sub: 'Per channel', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Patch', sub: 'Split into chunks', color: '#fbbf24', icon: '🧩' },
      { isArrow: true },
      { label: 'Embed', sub: 'Linear projection', color: '#a78bfa', icon: '🔄' },
      { isArrow: true },
      { label: 'Transformer', sub: 'Self-attention', color: '#a78bfa', icon: '👀' },
      { isArrow: true },
      { label: 'Forecast', sub: 'Flatten + linear', color: '#4ade80', icon: '🎯' },
    ],
  },
  'chronos': {
    generateData: () => generateSeededSine(50, 222),
    predict: (data, i) => data[i].value * 0.97 + 0.15,
    chartTitle: 'Chronos — Language Model for Time Series',
    predLabel: 'Chronos Output',
    color: '#f472b6',
    diagramTitle: '🔤 Tokenization Pipeline',
    architectureSteps: [
      { label: 'Values', sub: 'Real numbers', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Quantize', sub: 'Into bins', color: '#fbbf24', icon: '🔤' },
      { isArrow: true },
      { label: 'Tokens', sub: 'Like words', color: '#a78bfa', icon: '📝' },
      { isArrow: true },
      { label: 'T5 Model', sub: 'Pre-trained LM', color: '#f472b6', icon: '🤖' },
      { isArrow: true },
      { label: 'Decode', sub: 'Back to values', color: '#4ade80', icon: '🎯' },
    ],
  },
  'timesfm': {
    generateData: () => generateSeededSine(50, 333),
    predict: (data, i) => data[i].value * 0.98 + 0.1,
    chartTitle: 'TimesFM — Foundation Model Forecast',
    predLabel: 'TimesFM Output',
    color: '#f472b6',
    diagramTitle: '🏗️ Decoder-Only Architecture',
    architectureSteps: [
      { label: 'Input', sub: 'Any time series', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Patch', sub: 'Variable lengths', color: '#fbbf24', icon: '🧩' },
      { isArrow: true },
      { label: 'Decoder', sub: 'Causal attention', color: '#a78bfa', icon: '➡️' },
      { isArrow: true },
      { label: 'Zero-Shot', sub: 'No fine-tuning', color: '#f472b6', icon: '🎯' },
      { isArrow: true },
      { label: 'Forecast', sub: 'Output values', color: '#4ade80', icon: '📈' },
    ],
  },
  // ── Classical (new) ──
  'kalman-filter': {
    generateData: () => generateSeededSine(60, 501),
    predict: (data, i) => {
      if (i === 0) return data[0].value;
      const prev = data[i - 1].value * 0.97 + 0.15;
      return prev + 0.4 * (data[i].value - prev);
    },
    chartTitle: 'Kalman Filter — State Estimation',
    predLabel: 'Estimated State',
    color: '#4ade80',
    diagramTitle: '🔄 Predict-Update Cycle',
    architectureSteps: [
      { label: 'Prior State', sub: 'x̂(t|t-1)', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Predict', sub: 'State transition', color: '#a78bfa', icon: '🔮' },
      { isArrow: true },
      { label: 'Observation', sub: 'Noisy measurement', color: '#fbbf24', icon: '👁️' },
      { isArrow: true },
      { label: 'Kalman Gain', sub: 'Balance trust', color: '#f472b6', icon: '⚖️' },
      { isArrow: true },
      { label: 'Update', sub: 'x̂(t|t)', color: '#4ade80', icon: '✅' },
    ],
  },
  'garch': {
    generateData: () => generateRandomWalk(80, 100, 3),
    predict: (data, i) => {
      const vol = Math.abs(data[i].value - data[Math.max(0, i - 1)].value);
      return data[i].value + (vol > 2 ? 0.5 : -0.3);
    },
    chartTitle: 'GARCH — Volatility Modeling',
    predLabel: 'GARCH Fit',
    color: '#fbbf24',
    diagramTitle: '📊 Volatility Clustering',
    architectureSteps: [
      { label: 'Returns', sub: 'Price changes', color: '#60a5fa', icon: '📈' },
      { isArrow: true },
      { label: 'Past Shocks', sub: 'ε²(t-1)', color: '#fbbf24', icon: '💥' },
      { label: 'Past Var', sub: 'σ²(t-1)', color: '#a78bfa', icon: '📐' },
      { isArrow: true },
      { label: 'σ²(t)', sub: 'Current volatility', color: '#f472b6', icon: '📊' },
      { isArrow: true },
      { label: 'VaR', sub: 'Risk estimate', color: '#4ade80', icon: '🛡️' },
    ],
  },
  'var': {
    generateData: () => generateSeededSine(60, 502),
    predict: (data, i) => data[i].value * 0.95 + 0.25,
    chartTitle: 'VAR — Multivariate Autoregression',
    predLabel: 'VAR Predicted',
    color: '#60a5fa',
    diagramTitle: '🔗 Cross-Variable Dependencies',
    architectureSteps: [
      { label: 'Var 1 Lags', sub: 'y₁(t-1..p)', color: '#60a5fa', icon: '📊' },
      { label: 'Var 2 Lags', sub: 'y₂(t-1..p)', color: '#a78bfa', icon: '📊' },
      { label: 'Var N Lags', sub: 'yₙ(t-1..p)', color: '#f472b6', icon: '📊' },
      { isArrow: true },
      { label: 'Coeff Matrix', sub: 'A₁...Aₚ', color: '#fbbf24', icon: '⚖️' },
      { isArrow: true },
      { label: 'Joint Forecast', sub: 'All variables', color: '#4ade80', icon: '🎯' },
    ],
  },
  // ── Early ML (new) ──
  'ets': {
    generateData: () => generateTrendSeasonal(80, 0.04, 12, 1.2, 0.25),
    predict: (data, i) => data[i].value * 0.97 + 0.1,
    chartTitle: 'ETS — Error-Trend-Seasonal Framework',
    predLabel: 'ETS Fit',
    color: '#4ade80',
    diagramTitle: '🔢 ETS Component Selection',
    architectureSteps: [
      { label: 'Error', sub: '(A)dd or (M)ult', color: '#f472b6', icon: '❗' },
      { label: 'Trend', sub: 'N / A / Ad / M', color: '#4ade80', icon: '📈' },
      { label: 'Seasonal', sub: 'N / A / M', color: '#fbbf24', icon: '🌊' },
      { isArrow: true },
      { label: 'Select Best', sub: 'AIC / BIC', color: '#a78bfa', icon: '🏆' },
      { isArrow: true },
      { label: 'Forecast', sub: 'State space', color: '#4ade80', icon: '🎯' },
    ],
  },
  'esn': {
    generateData: () => generateSeededSine(60, 503),
    predict: (data, i) => data[i].value * 0.96 + (Math.sin(i * 0.2) * 0.08),
    chartTitle: 'Echo State Network — Reservoir Computing',
    predLabel: 'ESN Output',
    color: '#60a5fa',
    diagramTitle: '🌊 Reservoir Architecture',
    architectureSteps: [
      { label: 'Input', sub: 'x(t)', color: '#60a5fa', icon: '📥' },
      { isArrow: true },
      { label: 'Reservoir', sub: 'Random RNN (fixed)', color: '#a78bfa', icon: '🌊' },
      { isArrow: true },
      { label: 'States', sub: 'High-dimensional', color: '#fbbf24', icon: '🔮' },
      { isArrow: true },
      { label: 'Readout', sub: 'Linear (trained)', color: '#4ade80', icon: '📤' },
    ],
  },
  'gradient-boosting': {
    generateData: () => generateSeededSine(60, 504),
    predict: (data, i) => data[i].value * 0.97 + 0.15,
    chartTitle: 'Gradient Boosting — Sequential Ensemble',
    predLabel: 'GBM Prediction',
    color: '#4ade80',
    diagramTitle: '🚀 Sequential Error Correction',
    architectureSteps: [
      { label: 'Features', sub: 'Lag + calendar', color: '#60a5fa', icon: '🏗️' },
      { isArrow: true },
      { label: 'Tree 1', sub: 'Fit residuals', color: '#4ade80', icon: '🌲' },
      { isArrow: true },
      { label: 'Tree 2', sub: 'Fit new residuals', color: '#4ade80', icon: '🌲' },
      { isArrow: true },
      { label: 'Tree M', sub: 'Final residuals', color: '#4ade80', icon: '🌲' },
      { isArrow: true },
      { label: 'Sum All', sub: 'Weighted sum', color: '#fbbf24', icon: '📊' },
    ],
  },
  // ── Deep Learning (new) ──
  'xgboost': {
    generateData: () => generateSeededSine(60, 505),
    predict: (data, i) => data[i].value * 0.97 + (Math.cos(i * 0.1) * 0.05),
    chartTitle: 'XGBoost — Extreme Gradient Boosting',
    predLabel: 'XGBoost Predicted',
    color: '#4ade80',
    diagramTitle: '⚡ XGBoost Pipeline',
    architectureSteps: [
      { label: 'Features', sub: 'Lags + rolling', color: '#60a5fa', icon: '🏗️' },
      { isArrow: true },
      { label: 'Reg Trees', sub: 'L1 + L2 penalty', color: '#a78bfa', icon: '🛡️' },
      { isArrow: true },
      { label: 'Parallel', sub: 'Feature-parallel', color: '#fbbf24', icon: '⚡' },
      { isArrow: true },
      { label: 'Predict', sub: 'Weighted sum', color: '#4ade80', icon: '🎯' },
    ],
  },
  'lightgbm': {
    generateData: () => generateSeededSine(60, 506),
    predict: (data, i) => data[i].value * 0.96 + 0.2,
    chartTitle: 'LightGBM — Light Gradient Boosting',
    predLabel: 'LightGBM Output',
    color: '#4ade80',
    diagramTitle: '🌿 Leaf-Wise Growth',
    architectureSteps: [
      { label: 'Features', sub: 'Histogram bins', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'GOSS', sub: 'Smart sampling', color: '#a78bfa', icon: '🎯' },
      { isArrow: true },
      { label: 'Leaf-Wise', sub: 'Max loss leaf', color: '#fbbf24', icon: '🌿' },
      { isArrow: true },
      { label: 'Predict', sub: 'Fast inference', color: '#4ade80', icon: '⚡' },
    ],
  },
  'lstnet': {
    generateData: () => generateSeededSine(60, 507),
    predict: (data, i) => data[i].value * 0.95 + (Math.sin(i * 0.15) * 0.1),
    chartTitle: 'LSTNet — CNN + RNN Hybrid',
    predLabel: 'LSTNet Output',
    color: '#a78bfa',
    diagramTitle: '🔲 Hybrid Architecture',
    architectureSteps: [
      { label: 'Input', sub: 'Multivariate TS', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'CNN', sub: 'Local patterns', color: '#a78bfa', icon: '🔲' },
      { isArrow: true },
      { label: 'GRU', sub: 'Temporal deps', color: '#fbbf24', icon: '🧠' },
      { label: 'Skip-GRU', sub: 'Period=p skip', color: '#f472b6', icon: '⏭️' },
      { isArrow: true },
      { label: 'AR + Output', sub: 'Highway layer', color: '#4ade80', icon: '🛣️' },
    ],
  },
  'tcn': {
    generateData: () => generateSeededSine(60, 508),
    predict: (data, i) => data[i].value * 0.96 + (Math.cos(i * 0.2) * 0.06),
    chartTitle: 'TCN — Temporal Convolutional Network',
    predLabel: 'TCN Output',
    color: '#a78bfa',
    diagramTitle: '◀️ Causal Dilated Conv Stack',
    architectureSteps: [
      { label: 'Input', sub: 'Sequence', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'd=1', sub: 'Receptive: 2', color: '#a78bfa', icon: '◀️' },
      { isArrow: true },
      { label: 'd=2', sub: 'Receptive: 6', color: '#a78bfa', icon: '◀️' },
      { isArrow: true },
      { label: 'd=4', sub: 'Receptive: 14', color: '#a78bfa', icon: '◀️' },
      { isArrow: true },
      { label: 'Output', sub: 'Residual + predict', color: '#4ade80', icon: '🎯' },
    ],
  },
  // ── Modern (new) ──
  'autoformer': {
    generateData: () => generateTrendSeasonal(80, 0.03, 12, 1.5, 0.2),
    predict: (data, i) => data[i].value * 0.97 + 0.1,
    chartTitle: 'Autoformer — Auto-Correlation Attention',
    predLabel: 'Autoformer Output',
    color: '#f472b6',
    diagramTitle: '🔄 Auto-Correlation Mechanism',
    architectureSteps: [
      { label: 'Input', sub: 'Time series', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Decompose', sub: 'Trend + Season', color: '#fbbf24', icon: '📐' },
      { isArrow: true },
      { label: 'Auto-Corr', sub: 'Period attention', color: '#a78bfa', icon: '🔄' },
      { isArrow: true },
      { label: 'Aggregate', sub: 'Time-delay agg', color: '#f472b6', icon: '📊' },
      { isArrow: true },
      { label: 'Forecast', sub: 'Long-term', color: '#4ade80', icon: '🎯' },
    ],
  },
  'informer': {
    generateData: () => generateSeededSine(80, 509),
    predict: (data, i) => data[i].value * 0.96 + 0.2,
    chartTitle: 'Informer — Efficient Long Sequence Forecasting',
    predLabel: 'Informer Output',
    color: '#f472b6',
    diagramTitle: '⚡ ProbSparse Attention',
    architectureSteps: [
      { label: 'Input', sub: 'Long sequence', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'ProbSparse', sub: 'Top-K queries', color: '#a78bfa', icon: '⚡' },
      { isArrow: true },
      { label: 'Distilling', sub: 'Halve sequence', color: '#fbbf24', icon: '🔻' },
      { isArrow: true },
      { label: 'Gen Decoder', sub: 'One-pass output', color: '#f472b6', icon: '🚀' },
      { isArrow: true },
      { label: 'Forecast', sub: 'All at once', color: '#4ade80', icon: '🎯' },
    ],
  },
  'fedformer': {
    generateData: () => generateTrendSeasonal(80, 0.02, 12, 1.3, 0.2),
    predict: (data, i) => data[i].value * 0.97 + 0.15,
    chartTitle: 'FEDformer — Frequency-Enhanced Transformer',
    predLabel: 'FEDformer Output',
    color: '#f472b6',
    diagramTitle: '〰️ Frequency Domain Attention',
    architectureSteps: [
      { label: 'Input', sub: 'Time domain', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'FFT', sub: 'To frequency', color: '#a78bfa', icon: '〰️' },
      { isArrow: true },
      { label: 'Freq Attn', sub: 'Element-wise', color: '#fbbf24', icon: '✖️' },
      { isArrow: true },
      { label: 'MOEDecomp', sub: 'Adaptive', color: '#f472b6', icon: '🔀' },
      { isArrow: true },
      { label: 'IFFT', sub: 'Back to time', color: '#4ade80', icon: '🎯' },
    ],
  },
  'nhits': {
    generateData: () => generateTrendSeasonal(80, 0.03, 12, 1, 0.2),
    predict: (data, i) => data[i].value * 0.98 + 0.05,
    chartTitle: 'N-HiTS — Hierarchical Time Series',
    predLabel: 'N-HiTS Fit',
    color: '#f472b6',
    diagramTitle: '🔬 Multi-Rate Hierarchical Blocks',
    architectureSteps: [
      { label: 'Input', sub: 'Lookback', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Fine', sub: 'Rate=1', color: '#a78bfa', icon: '🔬' },
      { label: 'Mid', sub: 'Rate=4', color: '#a78bfa', icon: '🔭' },
      { label: 'Coarse', sub: 'Rate=16', color: '#a78bfa', icon: '🌍' },
      { isArrow: true },
      { label: 'Interpolate', sub: 'To target res', color: '#fbbf24', icon: '📊' },
      { isArrow: true },
      { label: 'Sum', sub: 'Final forecast', color: '#4ade80', icon: '🎯' },
    ],
  },
  'etsformer': {
    generateData: () => generateTrendSeasonal(80, 0.03, 12, 1.2, 0.2),
    predict: (data, i) => data[i].value * 0.97 + 0.1,
    chartTitle: 'ETSformer — ETS + Transformer',
    predLabel: 'ETSformer Output',
    color: '#f472b6',
    diagramTitle: '📉 ETS-Guided Attention',
    architectureSteps: [
      { label: 'Input', sub: 'Time series', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'ES-Attn', sub: 'Exp smoothing', color: '#a78bfa', icon: '📉' },
      { label: 'Freq-Attn', sub: 'Fourier seasonal', color: '#fbbf24', icon: '〰️' },
      { isArrow: true },
      { label: 'Growth', sub: 'Trend modeling', color: '#f472b6', icon: '📈' },
      { isArrow: true },
      { label: 'Forecast', sub: 'L + T + S', color: '#4ade80', icon: '🎯' },
    ],
  },
  'dlinear': {
    generateData: () => generateTrendSeasonal(80, 0.04, 12, 1.5, 0.3),
    predict: (data, i) => data[i].value * 0.98 + 0.08,
    chartTitle: 'DLinear — Simple Linear Model',
    predLabel: 'DLinear Output',
    color: '#f472b6',
    diagramTitle: '📊 Decompose + Linear',
    architectureSteps: [
      { label: 'Input', sub: 'Lookback', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Moving Avg', sub: 'Extract trend', color: '#fbbf24', icon: '📈' },
      { isArrow: true },
      { label: 'Linear₁', sub: 'Trend → Forecast', color: '#a78bfa', icon: '📐' },
      { label: 'Linear₂', sub: 'Remainder → Forecast', color: '#f472b6', icon: '📐' },
      { isArrow: true },
      { label: 'Sum', sub: 'Final output', color: '#4ade80', icon: '➕' },
    ],
  },
  'timesnet': {
    generateData: () => generateTrendSeasonal(80, 0.02, 12, 1.5, 0.2),
    predict: (data, i) => data[i].value * 0.97 + 0.12,
    chartTitle: 'TimesNet — 2D Variation Modeling',
    predLabel: 'TimesNet Output',
    color: '#f472b6',
    diagramTitle: '🔄 1D → 2D Reshape Pipeline',
    architectureSteps: [
      { label: '1D Series', sub: 'Time domain', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'FFT', sub: 'Find periods', color: '#fbbf24', icon: '🎵' },
      { isArrow: true },
      { label: 'Reshape', sub: '1D → 2D', color: '#a78bfa', icon: '🔄' },
      { isArrow: true },
      { label: '2D Conv', sub: 'Inception', color: '#f472b6', icon: '🔲' },
      { isArrow: true },
      { label: 'Flatten', sub: 'Back to 1D', color: '#4ade80', icon: '🎯' },
    ],
  },
  'itransformer': {
    generateData: () => generateSeededSine(60, 510),
    predict: (data, i) => data[i].value * 0.96 + 0.18,
    chartTitle: 'iTransformer — Inverted Attention',
    predLabel: 'iTransformer Output',
    color: '#f472b6',
    diagramTitle: '🔄 Inverted Architecture',
    architectureSteps: [
      { label: 'Variables', sub: 'Each = token', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Embed', sub: 'Time → feature', color: '#a78bfa', icon: '🔄' },
      { isArrow: true },
      { label: 'Attention', sub: 'Across variables', color: '#fbbf24', icon: '👀' },
      { isArrow: true },
      { label: 'FFN', sub: 'Across time', color: '#f472b6', icon: '📐' },
      { isArrow: true },
      { label: 'Forecast', sub: 'All variables', color: '#4ade80', icon: '🎯' },
    ],
  },
  'timegpt': {
    generateData: () => generateSeededSine(50, 511),
    showProbabilistic: true,
    chartTitle: 'TimeGPT — Zero-Shot Foundation Forecast',
    diagramTitle: '🏗️ Foundation Model Pipeline',
    architectureSteps: [
      { label: 'Any TS', sub: 'No training', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'API Call', sub: 'Send to cloud', color: '#a78bfa', icon: '☁️' },
      { isArrow: true },
      { label: 'Pre-trained', sub: '100B+ points', color: '#fbbf24', icon: '🏗️' },
      { isArrow: true },
      { label: 'Zero-Shot', sub: 'Instant forecast', color: '#f472b6', icon: '🎯' },
      { isArrow: true },
      { label: 'Intervals', sub: 'With uncertainty', color: '#4ade80', icon: '📊' },
    ],
  },
  'lag-llama': {
    generateData: () => generateSeededSine(50, 512),
    showProbabilistic: true,
    chartTitle: 'Lag-Llama — LLM-Style Probabilistic Forecast',
    diagramTitle: '📌 Lag-Based Tokenization',
    architectureSteps: [
      { label: 'Lag Indices', sub: 'Seasonal lags', color: '#60a5fa', icon: '📌' },
      { isArrow: true },
      { label: 'Embed', sub: 'Lag features', color: '#a78bfa', icon: '🔄' },
      { isArrow: true },
      { label: 'Decoder', sub: 'Causal Transformer', color: '#fbbf24', icon: '🧠' },
      { isArrow: true },
      { label: 'Student-t', sub: 'Distribution params', color: '#f472b6', icon: '🎲' },
      { isArrow: true },
      { label: 'Forecast', sub: 'Probabilistic', color: '#4ade80', icon: '📊' },
    ],
  },
  'moirai': {
    generateData: () => generateSeededSine(50, 513),
    predict: (data, i) => data[i].value * 0.97 + 0.14,
    chartTitle: 'Moirai — Universal Forecasting Model',
    predLabel: 'Moirai Output',
    color: '#f472b6',
    diagramTitle: '📊 Universal Architecture',
    architectureSteps: [
      { label: 'Any TS', sub: 'Any freq/variate', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Tokenize', sub: 'Adaptive patch', color: '#a78bfa', icon: '🧩' },
      { isArrow: true },
      { label: 'Transformer', sub: 'LOTSA trained', color: '#fbbf24', icon: '🧠' },
      { isArrow: true },
      { label: 'Mixture', sub: 'Distribution', color: '#f472b6', icon: '🎲' },
      { isArrow: true },
      { label: 'Forecast', sub: 'Any horizon', color: '#4ade80', icon: '🎯' },
    ],
  },
  'moment': {
    generateData: () => generateSeededSine(50, 514),
    predict: (data, i) => data[i].value * 0.97 + 0.12,
    chartTitle: 'MOMENT — General-Purpose TS Foundation',
    predLabel: 'MOMENT Output',
    color: '#f472b6',
    diagramTitle: '🎭 Multi-Task Foundation Model',
    architectureSteps: [
      { label: 'Time Series', sub: 'Any task', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Patch', sub: 'Like PatchTST', color: '#a78bfa', icon: '🧩' },
      { isArrow: true },
      { label: 'Mask Train', sub: 'Like BERT', color: '#fbbf24', icon: '🎭' },
      { isArrow: true },
      { label: 'Task Head', sub: 'Forecast/Classify', color: '#f472b6', icon: '🎯' },
      { isArrow: true },
      { label: 'Output', sub: 'Lightweight', color: '#4ade80', icon: '💻' },
    ],
  },
  'time-moe': {
    generateData: () => generateSeededSine(50, 515),
    predict: (data, i) => data[i].value * 0.97 + 0.11,
    chartTitle: 'Time-MoE — Mixture of Experts',
    predLabel: 'Time-MoE Output',
    color: '#f472b6',
    diagramTitle: '👨‍🔬 Expert Routing',
    architectureSteps: [
      { label: 'Input', sub: 'Time series', color: '#60a5fa', icon: '📊' },
      { isArrow: true },
      { label: 'Router', sub: 'Gating network', color: '#fbbf24', icon: '🔀' },
      { isArrow: true },
      { label: 'Expert₁', sub: 'Trend specialist', color: '#a78bfa', icon: '👨‍🔬' },
      { label: 'Expert₂', sub: 'Season specialist', color: '#a78bfa', icon: '👨‍🔬' },
      { isArrow: true },
      { label: 'Combine', sub: 'Weighted', color: '#f472b6', icon: '⚡' },
      { isArrow: true },
      { label: 'Forecast', sub: 'Billion params', color: '#4ade80', icon: '🎯' },
    ],
  },
};

