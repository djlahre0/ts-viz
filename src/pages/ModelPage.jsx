import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getModelById, ERA_LABELS, MODELS } from '../data/models';
import PaperLink from '../components/shared/PaperLink';
import ConceptBlock from '../components/shared/ConceptBlock';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

// Rich model components
import MovingAverageViz from '../components/models/classical/MovingAverage';
import ExponentialSmoothingViz from '../components/models/classical/ExponentialSmoothing';
import AutoRegressiveViz from '../components/models/classical/AutoRegressive';
import ARIMAViz from '../components/models/classical/ARIMA';
import SARIMAViz from '../components/models/classical/SARIMA';
import RNNViz from '../components/models/earlyml/RNN';
import LSTMViz from '../components/models/earlyml/LSTM';
import TransformerViz from '../components/models/deeplearning/Transformer';
import ProphetViz from '../components/models/deeplearning/Prophet';
import TFTViz from '../components/models/modern/TFT';

// Light model component
import LightModelViz from '../components/models/LightModelViz';

const RICH_COMPONENTS = {
  'moving-average': MovingAverageViz,
  'exponential-smoothing': ExponentialSmoothingViz,
  'autoregressive': AutoRegressiveViz,
  'arima': ARIMAViz,
  'sarima': SARIMAViz,
  'rnn': RNNViz,
  'lstm': LSTMViz,
  'transformer': TransformerViz,
  'prophet': ProphetViz,
  'tft': TFTViz,
};

export default function ModelPage() {
  const { modelId } = useParams();
  const model = getModelById(modelId);

  if (!model) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2>Model not found</h2>
        <p style={{ marginBottom: 'var(--space-lg)' }}>The model "{modelId}" doesn't exist.</p>
        <Link to="/" className="btn btn--primary">← Back to Home</Link>
      </div>
    );
  }

  const eraInfo = ERA_LABELS[model.era];
  const RichComponent = RICH_COMPONENTS[model.id];
  const isRich = !!RichComponent;

  // Navigation (prev/next model)
  const currentIndex = MODELS.findIndex(m => m.id === model.id);
  const prevModel = currentIndex > 0 ? MODELS[currentIndex - 1] : null;
  const nextModel = currentIndex < MODELS.length - 1 ? MODELS[currentIndex + 1] : null;

  return (
    <motion.div
      key={modelId}
      className="model-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-lg)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: eraInfo.color }}>{eraInfo.name}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{model.shortName}</span>
      </div>

      {/* Header */}
      <div className="model-header">
        <div className="model-header__top">
          <h1 className="model-header__title">{model.name}</h1>
          <span className="model-header__year">{model.year}</span>
          <span className={`era-badge era-badge--${model.era}`}>{eraInfo.name}</span>
          {model.difficulty && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 12px', borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: model.difficulty === 'beginner' ? 'rgba(74,222,128,0.1)'
                : model.difficulty === 'intermediate' ? 'rgba(251,191,36,0.1)'
                : 'rgba(244,114,182,0.1)',
              color: model.difficulty === 'beginner' ? '#4ade80'
                : model.difficulty === 'intermediate' ? '#fbbf24'
                : '#f472b6',
              border: `1px solid ${model.difficulty === 'beginner' ? 'rgba(74,222,128,0.25)'
                : model.difficulty === 'intermediate' ? 'rgba(251,191,36,0.25)'
                : 'rgba(244,114,182,0.25)'}`,
            }}>
              <span className="difficulty-dot" style={{
                background: model.difficulty === 'beginner' ? '#4ade80'
                  : model.difficulty === 'intermediate' ? '#fbbf24' : '#f472b6',
              }} />
              {model.difficulty}
            </span>
          )}
        </div>
        <p className="model-header__description">{model.description}</p>
      </div>

      {/* Visualization */}
      <div className="model-section">
        <h3 className="model-section__title">
          <span>{isRich ? '⚡' : '📊'}</span> {isRich ? 'Interactive Simulation' : 'Model Visualization'}
        </h3>
        {isRich ? <RichComponent /> : <LightModelViz modelId={model.id} />}
      </div>

      {/* Real-World Usage */}
      {model.realWorld && (
        <div className="model-section">
          <h3 className="model-section__title">
            <span>🌍</span> Where is this used?
          </h3>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)',
          }}>
            {model.realWorld.split(', ').map((use, i) => (
              <span key={i} style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}>
                {use}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key Concepts */}
      <div className="model-section">
        <h3 className="model-section__title">
          <BookOpen size={18} /> Key Concepts
        </h3>
        <ConceptBlock concepts={model.concepts} eraColor={eraInfo.color} />
      </div>

      {/* Paper Link */}
      <div className="model-section">
        <h3 className="model-section__title">
          <span>📄</span> Original Paper
        </h3>
        <PaperLink paper={model.paper} />
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--space-3xl)',
        paddingTop: 'var(--space-xl)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {prevModel ? (
          <Link to={`/model/${prevModel.id}`} className="btn btn--ghost" style={{ gap: '6px' }}>
            <ChevronLeft size={16} /> {prevModel.shortName}
          </Link>
        ) : <div />}
        {nextModel ? (
          <Link to={`/model/${nextModel.id}`} className="btn btn--ghost" style={{ gap: '6px' }}>
            {nextModel.shortName} <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </motion.div>
  );
}
