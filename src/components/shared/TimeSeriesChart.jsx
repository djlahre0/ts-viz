import { useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(14, 14, 22, 0.95)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      backdropFilter: 'blur(12px)',
      fontSize: '0.8rem',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
        t = {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {typeof p.value === 'number' ? p.value.toFixed(3) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Reusable time series chart component.
 * @param {Object} props
 * @param {Array} props.data - Array of data objects with 't' key
 * @param {Array} props.lines - Array of { dataKey, color, name, strokeWidth, dashArray }
 * @param {Array} [props.areas] - Array of { dataKey, color, name, opacity }
 * @param {number} [props.height] - Chart height
 * @param {boolean} [props.showGrid] - Show grid lines
 * @param {string} [props.title] - Chart title
 */
export default function TimeSeriesChart({
  data,
  lines = [],
  areas = [],
  height = 350,
  showGrid = true,
  title,
  xLabel = 'Time',
  yLabel = 'Value',
  referenceLine,
  animationDuration = 800,
}) {
  const ChartComponent = areas.length > 0 ? AreaChart : LineChart;

  return (
    <div className="chart-container">
      {title && (
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-md)',
        }}>
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="t"
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />

          {areas.map((area, i) => (
            <Area
              key={`area-${i}`}
              type="monotone"
              dataKey={area.dataKey}
              stroke={area.color}
              fill={area.color}
              fillOpacity={area.opacity || 0.1}
              strokeWidth={area.strokeWidth || 0}
              name={area.name || area.dataKey}
              animationDuration={animationDuration}
              dot={false}
            />
          ))}

          {lines.map((line, i) => (
            <Line
              key={`line-${i}`}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.dashArray || undefined}
              name={line.name || line.dataKey}
              dot={false}
              activeDot={{ r: 4, stroke: line.color, fill: 'var(--bg-primary)', strokeWidth: 2 }}
              animationDuration={animationDuration}
              connectNulls={false}
            />
          ))}

          {referenceLine && (
            <ReferenceLine
              x={referenceLine.x}
              stroke={referenceLine.color || 'rgba(255,255,255,0.2)'}
              strokeDasharray="5 5"
              label={{
                value: referenceLine.label,
                fill: 'var(--text-muted)',
                fontSize: 11,
              }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
