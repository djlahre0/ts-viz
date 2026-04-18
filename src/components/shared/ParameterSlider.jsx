/**
 * Interactive parameter slider for model controls.
 */
export default function ParameterSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  unit = '',
  description,
}) {
  return (
    <div className="slider-container">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">
          {typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      {description && (
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
          marginTop: '2px',
        }}>
          {description}
        </div>
      )}
    </div>
  );
}
