import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getModelsByEra, ERA_LABELS } from '../data/models';
import { ArrowRight, Layers, Brain, Cpu, Sparkles } from 'lucide-react';

const ERA_ICONS = {
  classical: Layers,
  earlyml: Brain,
  deeplearning: Cpu,
  modern: Sparkles,
};

export default function Home() {
  const modelsByEra = getModelsByEra();
  const totalModels = Object.values(modelsByEra).flat().length;

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="home-hero">
        <motion.h1
          className="home-hero__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Time Series ML Models
        </motion.h1>
        <motion.p
          className="home-hero__subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Interactive visual simulations of every major time series forecasting model —
          from classical statistics to modern foundation models. Learn by doing.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}
        >
          <Link to={`/model/moving-average`} className="btn btn--primary">
            Start Exploring <ArrowRight size={16} />
          </Link>
          <Link to="/compare" className="btn btn--ghost">
            Compare Models
          </Link>
        </motion.div>

        <motion.div
          className="home-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="home-stat">
            <div className="home-stat__number">{totalModels}</div>
            <div className="home-stat__label">Models</div>
          </div>
          <div className="home-stat">
            <div className="home-stat__number">4</div>
            <div className="home-stat__label">Eras</div>
          </div>
          <div className="home-stat">
            <div className="home-stat__number">100+</div>
            <div className="home-stat__label">Years of Research</div>
          </div>
        </motion.div>
      </div>

      {/* Learning Path */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: 'var(--space-3xl)' }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
          marginBottom: 'var(--space-lg)',
        }}>
          <span style={{ fontSize: '1.25rem' }}>🗺️</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Suggested Learning Path</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            New to ML? Start here ↓
          </span>
        </div>
        <div className="learning-path">
          {[
            { num: '0', name: 'Learn the Basics', desc: 'What is ML & time series?', link: '/learn', color: '#4ade80' },
            { num: '1', name: 'Moving Average', desc: 'Simplest model', link: '/model/moving-average', color: '#4ade80' },
            { num: '2', name: 'Exp. Smoothing', desc: 'Add weighted memory', link: '/model/exponential-smoothing', color: '#4ade80' },
            { num: '3', name: 'ARIMA', desc: 'Industry standard', link: '/model/arima', color: '#fbbf24' },
            { num: '4', name: 'LSTM', desc: 'Your first neural net', link: '/model/lstm', color: '#60a5fa' },
            { num: '5', name: 'Compare', desc: 'See the differences', link: '/compare', color: '#a78bfa' },
          ].map((step, i) => (
            <Link key={step.num} to={step.link} style={{ textDecoration: 'none' }}>
              <motion.div
                className="learning-path__step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                <div className="learning-path__num" style={{
                  background: `${step.color}15`, color: step.color,
                  border: `1px solid ${step.color}30`,
                }}>{step.num}</div>
                <div className="learning-path__name">{step.name}</div>
                <div className="learning-path__desc">{step.desc}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="timeline" style={{ marginTop: 'var(--space-3xl)' }}>
        {Object.entries(modelsByEra).map(([era, models], eraIdx) => {
          const eraInfo = ERA_LABELS[era];
          const EraIcon = ERA_ICONS[era];

          return (
            <motion.div
              key={era}
              className={`timeline-era timeline-era--${era}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: eraIdx * 0.15 }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-md)',
              }}>
                <EraIcon size={18} style={{ color: eraInfo.color }} />
                <h2
                  className="timeline-era__title"
                  style={{ color: eraInfo.color, marginBottom: 0 }}
                >
                  {eraInfo.name}
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  marginLeft: 'auto',
                }}>
                  {eraInfo.period}
                </span>
              </div>

              <div className="model-grid">
                {models.map((model, modelIdx) => (
                  <Link
                    key={model.id}
                    to={`/model/${model.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      className={`model-card model-card--${era}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: eraIdx * 0.15 + modelIdx * 0.05 }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-xs)',
                      }}>
                        <div className="model-card__name">{model.name}</div>
                        {model.type === 'rich' && (
                          <span style={{
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            color: eraInfo.color,
                            background: `${eraInfo.color}15`,
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-full)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            Interactive
                          </span>
                        )}
                      </div>
                      <div className="model-card__year">{model.year}</div>
                      <div className="model-card__description">{model.keyIdea}</div>
                      <div className="model-card__footer">
                        <span className="model-card__type">
                          {model.type === 'rich' ? '⚡ Rich Simulation' : '📊 Visualization'}
                        </span>
                        <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
