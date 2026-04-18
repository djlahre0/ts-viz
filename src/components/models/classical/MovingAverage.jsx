import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeSeriesChart from '../../shared/TimeSeriesChart';
import ParameterSlider from '../../shared/ParameterSlider';
import { generateSeededSine } from '../../../data/generators';
import { movingAverage } from '../../../utils/timeseries';

export default function MovingAverageViz() {
  const [windowSize, setWindowSize] = useState(5);
  const [dataLength, setDataLength] = useState(80);
  const [noise, setNoise] = useState(0.8);

  const rawData = useMemo(() => {
    const rng = ((seed) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })(42);
    return Array.from({ length: dataLength }, (_, i) => ({
      t: i,
      value: 5 + 2 * Math.sin(2 * Math.PI * 0.04 * i) + (rng() - 0.5) * noise * 2,
    }));
  }, [dataLength, noise]);

  const smoothed = useMemo(() => movingAverage(rawData, windowSize), [rawData, windowSize]);

  const chartData = useMemo(() => {
    return rawData.map((d, i) => ({
      t: d.t,
      original: d.value,
      smoothed: smoothed[i]?.value ?? null,
    }));
  }, [rawData, smoothed]);

  // Window visualization data
  const windowDemo = useMemo(() => {
    const center = Math.min(Math.floor(dataLength * 0.6), dataLength - 1);
    const start = Math.max(0, center - windowSize + 1);
    const end = center;
    const windowValues = rawData.slice(start, end + 1).map(d => d.value);
    const avg = windowValues.reduce((a, b) => a + b, 0) / windowValues.length;
    return { start, end, center, avg, values: windowValues };
  }, [rawData, windowSize, dataLength]);

  return (
    <div>
      {/* Interactive Controls */}
      <div className="controls-panel">
        <ParameterSlider
          label="Window Size"
          value={windowSize}
          onChange={setWindowSize}
          min={2}
          max={30}
          step={1}
          description="Number of points to average"
        />
        <ParameterSlider
          label="Data Length"
          value={dataLength}
          onChange={setDataLength}
          min={30}
          max={150}
          step={1}
          description="Total data points"
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

      {/* Main Chart */}
      <TimeSeriesChart
        data={chartData}
        lines={[
          { dataKey: 'original', color: 'rgba(129, 140, 248, 0.4)', name: 'Original Data', strokeWidth: 1.5 },
          { dataKey: 'smoothed', color: '#4ade80', name: `MA(${windowSize})`, strokeWidth: 2.5 },
        ]}
        title="Moving Average Smoothing"
        height={350}
      />

      {/* Window Visualization */}
      <motion.div
        key={windowSize}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ marginTop: 'var(--space-lg)' }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          📏 How the Window Works (at t={windowDemo.center})
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-md)',
        }}>
          {windowDemo.values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#4ade80',
              }}
            >
              {v.toFixed(2)}
            </motion.div>
          ))}
          <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', padding: '0 4px' }}>→</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: windowDemo.values.length * 0.05 + 0.1, type: 'spring' }}
            style={{
              background: 'rgba(74, 222, 128, 0.2)',
              border: '2px solid #4ade80',
              borderRadius: 'var(--radius-md)',
              padding: '6px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#4ade80',
            }}
          >
            avg = {windowDemo.avg.toFixed(3)}
          </motion.div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          The {windowSize} values in the window are averaged to produce the smoothed output at each position.
          The window then slides forward by one position.
        </div>
      </motion.div>
    </div>
  );
}
