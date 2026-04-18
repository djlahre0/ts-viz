import { useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import { generateSeededSine } from '../../../data/generators';

export default function RNNViz() {
  const data = useMemo(() => generateSeededSine(60, 42), []);

  // Simulated RNN predictions (shifted + smoothed)
  const chartData = data.map((d, i) => ({
    t: d.t,
    original: d.value,
    predicted: i > 3 ? data[i - 1].value * 0.7 + data[i].value * 0.3 + (Math.random() - 0.5) * 0.15 : null,
  }));

  const timeSteps = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div>
      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: '#60a5fa', name: 'Original', strokeWidth: 2 },
          { dataKey: 'predicted', color: '#4ade80', name: 'RNN Predicted', strokeWidth: 2 },
        ]}
        title="RNN Time Series Prediction"
        height={300}
      />

      {/* Unrolled RNN Architecture */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          🧠 Unrolled RNN Architecture
        </div>
        <div className="architecture-diagram" style={{ minHeight: '250px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
          }}>
            {timeSteps.map((step) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step * 0.15, type: 'spring' }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
              >
                {/* Output */}
                <motion.div
                  className="node node--output"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.15 + 0.3 }}
                  style={{ fontSize: '0.7rem' }}
                >
                  ŷ(t{step > 0 ? `+${step}` : ''})
                </motion.div>

                {/* Arrow up */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: step * 0.15 + 0.2 }}
                  style={{ width: '2px', height: '20px', background: 'rgba(74, 222, 128, 0.4)' }}
                />

                {/* Hidden state */}
                <motion.div
                  className="node node--hidden"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.15 + 0.1, type: 'spring' }}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '0.65rem', textAlign: 'center' }}
                >
                  h(t{step > 0 ? `+${step}` : ''})
                </motion.div>

                {/* Arrow up */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: step * 0.15 }}
                  style={{ width: '2px', height: '20px', background: 'rgba(96, 165, 250, 0.4)' }}
                />

                {/* Input */}
                <motion.div
                  className="node node--input"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.15 }}
                  style={{ fontSize: '0.7rem' }}
                >
                  x(t{step > 0 ? `+${step}` : ''})
                </motion.div>
              </motion.div>
            ))}

            {/* Hidden state connections (horizontal arrows) */}
            {timeSteps.slice(0, -1).map((step) => (
              <motion.div
                key={`arrow-${step}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: step * 0.15 + 0.4 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${step * (76 + 16) + 70}px`,
                  width: '22px',
                  height: '2px',
                  background: 'linear-gradient(90deg, rgba(167, 139, 250, 0.6), rgba(167, 139, 250, 0.2))',
                  transformOrigin: 'left',
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
          The hidden state <span style={{ color: '#a78bfa' }}>h(t)</span> is passed from one time step to the next,
          carrying information about the sequence history. Each step uses the{' '}
          <span style={{ color: '#60a5fa' }}>same weights</span>.
        </div>
      </div>
    </div>
  );
}
