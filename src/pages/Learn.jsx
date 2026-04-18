import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  ResponsiveContainer, CartesianGrid, Tooltip,
} from 'recharts';
import {
  ArrowRight, BookOpen, TrendingUp, Brain, Sparkles,
  Cloud, DollarSign, ShoppingCart, Heart,
  Layers, Cpu, GraduationCap, Target, Eye, Zap,
} from 'lucide-react';

/* ─── helper: seeded random ─── */
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/* ─── data generators ─── */
function makeTrendData(len = 80) {
  const rng = seeded(11);
  return Array.from({ length: len }, (_, i) => ({
    t: i, trend: 2 + 0.06 * i, noise: 0, seasonal: 0,
    value: 2 + 0.06 * i + (rng() - 0.5) * 0.15,
  }));
}
function addSeasonal(data, amp = 1.5, period = 14) {
  return data.map((d, i) => {
    const s = amp * Math.sin((2 * Math.PI * i) / period);
    return { ...d, seasonal: s, value: d.value + s };
  });
}
function addNoise(data, level = 0.6) {
  const rng = seeded(77);
  return data.map(d => {
    const n = (rng() - 0.5) * level * 2;
    return { ...d, noise: n, value: d.value + n };
  });
}

/* ─── section animation wrapper ─── */
const Section = ({ children, delay = 0 }) => (
  <motion.section
    className="learn-section"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.section>
);

const SectionTitle = ({ emoji, children }) => (
  <h2 className="learn-section__title">
    <span className="learn-section__emoji">{emoji}</span>
    {children}
  </h2>
);

/* ═══════════════════════════════════════════════════════
   LEARN PAGE
   ═══════════════════════════════════════════════════════ */
export default function Learn() {
  /* interactive pattern builder state */
  const [showTrend, setShowTrend] = useState(true);
  const [showSeasonal, setShowSeasonal] = useState(false);
  const [showNoise, setShowNoise] = useState(false);

  const patternData = useMemo(() => {
    let d = makeTrendData();
    if (showSeasonal) d = addSeasonal(d);
    if (showNoise) d = addNoise(d);
    if (!showTrend) d = d.map(p => ({ ...p, value: p.value - (2 + 0.06 * p.t) + 5 }));
    return d;
  }, [showTrend, showSeasonal, showNoise]);

  return (
    <div className="page-container learn-page">
      {/* ───────── HERO ───────── */}
      <div className="learn-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="learn-hero__badge">📖 Beginner Friendly</span>
          <h1 className="learn-hero__title">
            Learn Time Series<br />from Scratch
          </h1>
          <p className="learn-hero__sub">
            No prior machine learning knowledge required.
            We'll start from what ML is, walk through every key concept,
            and get you ready to explore <strong>43 models</strong>.
          </p>
        </motion.div>
      </div>

      {/* ───────── 1. WHAT IS MACHINE LEARNING? ───────── */}
      <Section>
        <SectionTitle emoji="🤖">What is Machine Learning?</SectionTitle>
        <p className="learn-p">
          Normally, we tell computers <em>exactly</em> what to do with code: 
          "if temperature {'>'} 30, turn on AC." That's <strong>traditional programming</strong>.
        </p>
        <p className="learn-p">
          <strong>Machine Learning</strong> flips this — instead of writing rules, we give the 
          computer <em>examples</em> (data) and let it <em>learn the patterns itself</em>.
        </p>

        <div className="learn-compare">
          <motion.div className="learn-compare__card"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
          >
            <div className="learn-compare__icon" style={{ background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.3)' }}>
              <Cpu size={28} style={{ color: '#60a5fa' }} />
            </div>
            <h4 style={{ color: '#60a5fa' }}>Traditional Programming</h4>
            <div className="learn-compare__flow">
              <span className="learn-pill" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Rules</span>
              <span className="learn-arrow">+</span>
              <span className="learn-pill" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Data</span>
              <span className="learn-arrow">→</span>
              <span className="learn-pill learn-pill--result" style={{ background: 'rgba(96,165,250,0.2)', color: '#60a5fa' }}>Output</span>
            </div>
            <p className="learn-compare__desc">You write the rules. Computer follows them.</p>
          </motion.div>

          <motion.div className="learn-compare__card"
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="learn-compare__icon" style={{ background: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.3)' }}>
              <Brain size={28} style={{ color: '#4ade80' }} />
            </div>
            <h4 style={{ color: '#4ade80' }}>Machine Learning</h4>
            <div className="learn-compare__flow">
              <span className="learn-pill" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>Data</span>
              <span className="learn-arrow">+</span>
              <span className="learn-pill" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>Output</span>
              <span className="learn-arrow">→</span>
              <span className="learn-pill learn-pill--result" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>Rules ✨</span>
            </div>
            <p className="learn-compare__desc">Computer discovers the rules from examples.</p>
          </motion.div>
        </div>
      </Section>

      {/* ───────── 2. ML CATEGORIES ───────── */}
      <Section>
        <SectionTitle emoji="🗂️">Types of Machine Learning</SectionTitle>
        <p className="learn-p">
          ML is a big field. Here are the main branches — and where <strong>time series</strong> fits in:
        </p>

        <div className="learn-ml-tree">
          {/* Root */}
          <motion.div className="learn-ml-tree__root"
            initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200 }}
          >
            <Brain size={20} /> Machine Learning
          </motion.div>

          <div className="learn-ml-tree__connector" />

          {/* Branches */}
          <div className="learn-ml-tree__branches">
            {[
              {
                title: 'Supervised Learning',
                desc: 'Learn from labeled examples',
                examples: 'Spam detection, Price prediction',
                color: '#60a5fa',
                icon: <Target size={18} />,
                hasTS: true,
              },
              {
                title: 'Unsupervised Learning',
                desc: 'Find hidden patterns in data',
                examples: 'Customer grouping, Anomaly detection',
                color: '#a78bfa',
                icon: <Eye size={18} />,
                hasTS: false,
              },
              {
                title: 'Reinforcement Learning',
                desc: 'Learn by trial & error with rewards',
                examples: 'Game AI, Robotics, Self-driving',
                color: '#fbbf24',
                icon: <Zap size={18} />,
                hasTS: false,
              },
            ].map((branch, i) => (
              <motion.div
                key={branch.title}
                className={`learn-ml-branch ${branch.hasTS ? 'learn-ml-branch--highlight' : ''}`}
                style={{ borderColor: `${branch.color}40` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="learn-ml-branch__icon" style={{ color: branch.color }}>{branch.icon}</div>
                <h4 style={{ color: branch.color }}>{branch.title}</h4>
                <p className="learn-ml-branch__desc">{branch.desc}</p>
                <p className="learn-ml-branch__examples">{branch.examples}</p>
                {branch.hasTS && (
                  <div className="learn-ml-branch__ts-badge">
                    📈 Time Series lives here!
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div className="learn-callout"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.4 }}
          >
            <TrendingUp size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            <span>
              <strong>Time series forecasting</strong> is mostly <strong>supervised learning</strong> — 
              the model learns from historical data (inputs) to predict future values (outputs). 
              Some modern models also borrow ideas from unsupervised learning (like self-supervised pre-training).
            </span>
          </motion.div>
        </div>
      </Section>

      {/* ───────── 3. WHAT IS TIME SERIES? ───────── */}
      <Section>
        <SectionTitle emoji="📈">What is Time Series?</SectionTitle>
        <p className="learn-p">
          A <strong>time series</strong> is simply a sequence of data points recorded over time. 
          Your phone's screen-time per day? That's a time series. Stock prices? Time series. 
          Daily temperature? Time series.
        </p>

        <div className="learn-ts-examples">
          {[
            { icon: <DollarSign size={22} />, label: 'Stock Prices', sub: 'Every second', color: '#4ade80' },
            { icon: <Cloud size={22} />, label: 'Weather', sub: 'Daily / hourly', color: '#60a5fa' },
            { icon: <ShoppingCart size={22} />, label: 'Sales Data', sub: 'Weekly / monthly', color: '#fbbf24' },
            { icon: <Heart size={22} />, label: 'Heart Rate', sub: 'Per beat', color: '#f472b6' },
          ].map((ex, i) => (
            <motion.div
              key={ex.label}
              className="learn-ts-example"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ borderColor: `${ex.color}30` }}
            >
              <div style={{ color: ex.color }}>{ex.icon}</div>
              <strong>{ex.label}</strong>
              <span className="learn-ts-example__sub">{ex.sub}</span>
            </motion.div>
          ))}
        </div>

        <p className="learn-p" style={{ marginTop: 'var(--space-lg)' }}>
          The key question: <strong>Can we predict what comes next?</strong> That's what 
          <em> forecasting</em> is all about — and that's what every model in this simulator tries to do.
        </p>
      </Section>

      {/* ───────── 4. KEY PATTERNS (interactive) ───────── */}
      <Section>
        <SectionTitle emoji="🔍">Key Patterns in Time Series</SectionTitle>
        <p className="learn-p">
          Every time series is a mix of three building blocks. Toggle them below to see how they combine:
        </p>

        <div className="learn-pattern-controls">
          {[
            { key: 'trend', label: '📈 Trend', desc: 'Long-term direction', active: showTrend, toggle: () => setShowTrend(p => !p), color: '#4ade80' },
            { key: 'seasonal', label: '🌊 Seasonality', desc: 'Repeating cycles', active: showSeasonal, toggle: () => setShowSeasonal(p => !p), color: '#60a5fa' },
            { key: 'noise', label: '⚡ Noise', desc: 'Random fluctuations', active: showNoise, toggle: () => setShowNoise(p => !p), color: '#fbbf24' },
          ].map(p => (
            <button
              key={p.key}
              className={`learn-pattern-btn ${p.active ? 'learn-pattern-btn--active' : ''}`}
              onClick={p.toggle}
              style={{
                borderColor: p.active ? p.color : 'var(--border-subtle)',
                background: p.active ? `${p.color}12` : 'transparent',
                color: p.active ? p.color : 'var(--text-secondary)',
              }}
            >
              <span className="learn-pattern-btn__label">{p.label}</span>
              <span className="learn-pattern-btn__desc">{p.desc}</span>
            </button>
          ))}
        </div>

        <div className="chart-container" style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            Your Time Series = {[showTrend && 'Trend', showSeasonal && 'Seasonality', showNoise && 'Noise'].filter(Boolean).join(' + ') || 'Nothing selected'}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={patternData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="t" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2.5} dot={false} animationDuration={600} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <motion.div className="learn-callout learn-callout--tip"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span>💡</span>
          <span>
            <strong>Try it!</strong> Turn on all three toggles. Real-world data almost always has
            trend + seasonality + noise mixed together. The job of a model is to
            separate and understand each component.
          </span>
        </motion.div>
      </Section>

      {/* ───────── 5. WHAT IS A MODEL? ───────── */}
      <Section>
        <SectionTitle emoji="🧠">What is a "Model"?</SectionTitle>
        <p className="learn-p">
          A model is like a <strong>recipe</strong> that a computer follows to make predictions.
          It looks at past data, finds patterns, and uses them to guess what happens next.
        </p>

        <div className="learn-model-flow">
          {[
            { label: 'Past Data', sub: 'What already happened', icon: '📊', color: '#60a5fa' },
            { label: 'Model', sub: 'Learns patterns', icon: '🧠', color: '#a78bfa' },
            { label: 'Prediction', sub: 'What might happen', icon: '🔮', color: '#4ade80' },
          ].map((step, i) => (
            <motion.div key={step.label} style={{ display: 'contents' }}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            >
              {i > 0 && <div className="learn-flow-arrow">→</div>}
              <div className="learn-flow-card" style={{ borderColor: `${step.color}40` }}>
                <span style={{ fontSize: '2rem' }}>{step.icon}</span>
                <strong style={{ color: step.color }}>{step.label}</strong>
                <span className="learn-flow-card__sub">{step.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="learn-p" style={{ marginTop: 'var(--space-xl)' }}>
          Some models are simple (just average the last few values), and some are incredibly complex
          (neural networks with billions of parameters). This simulator lets you see <strong>all 43</strong> of them
          in action — from the simplest to the most advanced.
        </p>
      </Section>

      {/* ───────── 6. THE EVOLUTION ───────── */}
      <Section>
        <SectionTitle emoji="🕰️">100 Years of Time Series Models</SectionTitle>
        <p className="learn-p">
          Models have evolved through four major eras. Each era built on the ideas before it:
        </p>

        <div className="learn-timeline">
          {[
            {
              era: 'Classical', period: '1920s–1980s', color: '#4ade80',
              icon: <Layers size={20} />,
              desc: 'Simple math rules — averages, weighted sums, linear equations.',
              models: 'Moving Average, ARIMA, Exponential Smoothing',
              analogy: 'Like predicting weather by checking if yesterday was sunny ☀️',
            },
            {
              era: 'Early ML', period: '1980s–2000s', color: '#60a5fa',
              icon: <Brain size={20} />,
              desc: 'First neural networks and tree-based algorithms enter the scene.',
              models: 'RNN, LSTM, Random Forest, SVR',
              analogy: 'Like teaching a dog new tricks with treats 🐕',
            },
            {
              era: 'Deep Learning', period: '2014–2020', color: '#a78bfa',
              icon: <Cpu size={20} />,
              desc: 'More powerful networks, attention mechanisms, and hybrid approaches.',
              models: 'Transformer, DeepAR, Prophet, XGBoost',
              analogy: 'Like having a team of experts each looking at different signals 👨‍🔬',
            },
            {
              era: 'Modern', period: '2021–Present', color: '#f472b6',
              icon: <Sparkles size={20} />,
              desc: 'Foundation models pre-trained on massive datasets — predict without training.',
              models: 'PatchTST, Chronos, TimesFM, TimeGPT',
              analogy: 'Like ChatGPT, but for numbers — it just "knows" patterns 🤯',
            },
          ].map((e, i) => (
            <motion.div
              key={e.era}
              className="learn-timeline__item"
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="learn-timeline__dot" style={{ background: e.color }} />
              <div className="learn-timeline__content" style={{ borderColor: `${e.color}35` }}>
                <div className="learn-timeline__header">
                  <span style={{ color: e.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {e.icon} <strong>{e.era}</strong>
                  </span>
                  <span className="learn-timeline__period">{e.period}</span>
                </div>
                <p className="learn-timeline__desc">{e.desc}</p>
                <p className="learn-timeline__analogy">💬 {e.analogy}</p>
                <p className="learn-timeline__models">Models: {e.models}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ───────── 7. GLOSSARY ───────── */}
      <Section>
        <SectionTitle emoji="📚">Key Terms Glossary</SectionTitle>
        <p className="learn-p">
          Quick reference for terms you'll encounter while exploring:
        </p>

        <div className="learn-glossary">
          {[
            { term: 'Forecasting', def: 'Predicting future values based on past patterns', icon: '🔮' },
            { term: 'Trend', def: 'The long-term increase or decrease in data', icon: '📈' },
            { term: 'Seasonality', def: 'Patterns that repeat at regular intervals (daily, weekly, yearly)', icon: '🌊' },
            { term: 'Noise', def: 'Random, unpredictable fluctuations in data', icon: '⚡' },
            { term: 'Stationarity', def: 'When a series has constant mean and variance over time (no trend)', icon: '➡️' },
            { term: 'Lag', def: 'A past time step — "lag 3" means the value from 3 steps ago', icon: '⏪' },
            { term: 'Overfitting', def: 'When a model memorizes training data instead of learning real patterns', icon: '🎯' },
            { term: 'Parameters', def: 'Knobs you can tune to control how a model behaves', icon: '🎛️' },
            { term: 'Epoch', def: 'One full pass through the training data', icon: '🔄' },
            { term: 'Loss / Error', def: 'How wrong the model\'s predictions are — lower is better', icon: '📉' },
            { term: 'Neural Network', def: 'A model inspired by the brain — layers of connected "neurons"', icon: '🧠' },
            { term: 'Foundation Model', def: 'A large model pre-trained on massive data, works on any task without retraining', icon: '🏗️' },
          ].map((g, i) => (
            <motion.div
              key={g.term}
              className="learn-glossary__item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
            >
              <span className="learn-glossary__icon">{g.icon}</span>
              <div>
                <strong className="learn-glossary__term">{g.term}</strong>
                <p className="learn-glossary__def">{g.def}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ───────── CTA ───────── */}
      <Section>
        <div className="learn-cta">
          <GraduationCap size={32} style={{ color: '#4ade80' }} />
          <h2 className="learn-cta__title">Ready to explore?</h2>
          <p className="learn-cta__sub">
            Start with the simplest model — Moving Average — and work your way up.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/model/moving-average" className="btn btn--primary">
              Start with Moving Average <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn btn--ghost">
              Browse All Models
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
