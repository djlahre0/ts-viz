import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import { generateSeededSine } from '../../../data/generators';

export default function LSTMViz() {
  const [activeGate, setActiveGate] = useState(null);
  const data = useMemo(() => generateSeededSine(60, 99), []);

  const chartData = data.map((d, i) => ({
    t: d.t,
    original: d.value,
    predicted: i > 5 ? d.value * 0.92 + (Math.sin(i * 0.3) * 0.08) : null,
  }));

  const gates = [
    { id: 'forget', name: 'Forget Gate', symbol: 'f', color: '#ef4444',
      desc: 'Decides what to remove from cell state. σ(Wf · [h(t-1), x(t)] + bf)', range: '0 = forget all, 1 = keep all' },
    { id: 'input', name: 'Input Gate', symbol: 'i', color: '#22c55e',
      desc: 'Decides what new information to store. σ(Wi · [h(t-1), x(t)] + bi)', range: 'Creates candidate values C̃(t)' },
    { id: 'output', name: 'Output Gate', symbol: 'o', color: '#3b82f6',
      desc: 'Decides what to output from cell state. σ(Wo · [h(t-1), x(t)] + bo)', range: 'Filters cell state for output' },
  ];

  return (
    <div>
      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: '#60a5fa', name: 'Original', strokeWidth: 2 },
          { dataKey: 'predicted', color: '#4ade80', name: 'LSTM Predicted', strokeWidth: 2 },
        ]}
        title="LSTM Time Series Prediction"
        height={280}
      />

      {/* LSTM Cell Architecture */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          🔒 LSTM Cell — Click a gate to learn more
        </div>
        <div className="architecture-diagram" style={{ minHeight: '280px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-md)',
            width: '100%',
            maxWidth: '500px',
          }}>
            {/* Cell State Highway */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '50px', textAlign: 'right' }}>C(t-1)</div>
              <motion.div
                animate={{ background: ['rgba(251, 191, 36, 0.2)', 'rgba(251, 191, 36, 0.4)', 'rgba(251, 191, 36, 0.2)'] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  position: 'relative',
                }}
              >
                {/* Data flow dot */}
                <motion.div
                  animate={{ left: ['-5%', '105%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#fbbf24',
                    boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)',
                  }}
                />
              </motion.div>
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', minWidth: '50px', fontWeight: 600 }}>C(t) →</div>
            </motion.div>

            {/* Gates Row */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-lg)',
              justifyContent: 'center',
            }}>
              {gates.map((gate, idx) => (
                <motion.button
                  key={gate.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.15, type: 'spring' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveGate(activeGate === gate.id ? null : gate.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  <motion.div
                    animate={activeGate === gate.id ? {
                      boxShadow: `0 0 20px ${gate.color}60`,
                      border: `2px solid ${gate.color}`,
                    } : {}}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: `${gate.color}15`,
                      border: `1px solid ${gate.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: gate.color,
                    }}
                  >
                    σ({gate.symbol})
                  </motion.div>
                  <span style={{ fontSize: '0.7rem', color: gate.color, fontWeight: 600 }}>
                    {gate.name}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Hidden State */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '50px', textAlign: 'right' }}>h(t-1)</div>
              <div style={{
                flex: 1,
                height: '4px',
                background: 'rgba(167, 139, 250, 0.3)',
                borderRadius: '2px',
              }} />
              <div style={{ fontSize: '0.7rem', color: '#a78bfa', minWidth: '50px', fontWeight: 600 }}>h(t) →</div>
            </motion.div>
          </div>
        </div>

        {/* Gate Details */}
        {activeGate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${gates.find(g => g.id === activeGate).color}30`,
            }}
          >
            {(() => {
              const gate = gates.find(g => g.id === activeGate);
              return (
                <>
                  <div style={{ fontWeight: 600, color: gate.color, marginBottom: '4px', fontSize: '0.85rem' }}>
                    {gate.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {gate.desc}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {gate.range}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
}
