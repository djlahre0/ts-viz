import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import { generateSeededSine } from '../../../data/generators';
import { simulateAttention } from '../../../utils/timeseries';

export default function TransformerViz() {
  const [headCount, setHeadCount] = useState(4);
  const data = useMemo(() => generateSeededSine(50, 55), []);
  const attention = useMemo(() => simulateAttention(10), []);

  const chartData = data.map((d, i) => ({
    t: d.t,
    original: d.value,
    predicted: i > 4 ? d.value * 0.95 + Math.sin(i * 0.2) * 0.1 : null,
  }));

  return (
    <div>
      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: '#a78bfa', name: 'Original', strokeWidth: 2 },
          { dataKey: 'predicted', color: '#4ade80', name: 'Transformer Predicted', strokeWidth: 2 },
        ]}
        title="Transformer Time Series Prediction"
        height={280}
      />

      {/* Attention Heatmap */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          👀 Self-Attention Heatmap
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          padding: 'var(--space-md)',
        }}>
          <div style={{ position: 'relative' }}>
            {/* Column labels */}
            <div style={{ display: 'flex', marginLeft: '40px', marginBottom: '4px' }}>
              {attention[0]?.map((_, j) => (
                <div key={j} style={{
                  width: '36px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                }}>t{j}</div>
              ))}
            </div>

            {/* Heatmap grid */}
            {attention.map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                  paddingRight: '4px',
                }}>t{i}</div>
                {row.map((val, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i * 10 + j) * 0.01 }}
                    style={{
                      width: '36px',
                      height: '36px',
                      background: `rgba(167, 139, 250, ${val})`,
                      border: '1px solid rgba(167, 139, 250, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      color: val > 0.15 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                    }}
                    title={`Attention from t${i} to t${j}: ${val.toFixed(3)}`}
                  >
                    {val > 0.08 ? (val * 100).toFixed(0) : ''}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
          Each cell shows how much attention position <span style={{color:'var(--text-secondary)'}}>row</span> pays to position <span style={{color:'var(--text-secondary)'}}>column</span>.
          Brighter = more attention. Rows sum to 100%.
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          🏗️ Transformer Architecture Flow
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: 'var(--space-lg)',
        }}>
          {[
            { label: 'Input Embedding + Positional Encoding', color: '#60a5fa', icon: '📍' },
            { label: `Multi-Head Self-Attention (${headCount} heads)`, color: '#a78bfa', icon: '🐙' },
            { label: 'Add & Layer Norm', color: 'var(--text-muted)', icon: '➕' },
            { label: 'Feed-Forward Network', color: '#f472b6', icon: '🔄' },
            { label: 'Add & Layer Norm', color: 'var(--text-muted)', icon: '➕' },
            { label: 'Output Projection', color: '#4ade80', icon: '📤' },
          ].map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                background: `${layer.color}08`,
                border: `1px solid ${layer.color}25`,
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: layer.color,
                fontWeight: 500,
              }}>
                <span>{layer.icon}</span>
                <span>{layer.label}</span>
              </div>
              {i < 5 && (
                <div style={{
                  width: '2px',
                  height: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  margin: '0 auto',
                }} />
              )}
            </motion.div>
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-md)',
          marginTop: 'var(--space-md)',
        }}>
          <div style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            background: 'rgba(167, 139, 250, 0.08)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(167, 139, 250, 0.15)',
          }}>
            Attention = softmax(QK<sup>T</sup>/√d<sub>k</sub>) × V
          </div>
        </div>
      </div>
    </div>
  );
}
