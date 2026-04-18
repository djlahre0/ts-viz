import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getModelsByEra, ERA_LABELS } from '../../data/models';
import {
  Home, GitCompare, ChevronDown, ChevronRight, Menu, X,
  Layers, Brain, Cpu, Sparkles, BookOpen, Search,
} from 'lucide-react';

const ERA_ICONS = {
  classical: Layers,
  earlyml: Brain,
  deeplearning: Cpu,
  modern: Sparkles,
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const modelsByEra = getModelsByEra();

  // Filter models based on search query
  const filteredModelsByEra = searchQuery.trim() === ''
    ? modelsByEra
    : Object.entries(modelsByEra).reduce((acc, [era, models]) => {
      const matchingModels = models.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.year?.toString().includes(searchQuery)
      );
      if (matchingModels.length > 0) acc[era] = matchingModels;
      return acc;
    }, {});

  const toggleEra = (era) => {
    setCollapsed(prev => ({ ...prev, [era]: !prev[era] }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 200,
          display: 'none',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={`sidebar ${mobileOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'var(--sidebar-width)',
          height: '100vh',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          overflowY: 'auto',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}>
              📈
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                TS Models
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                VISUAL SIMULATOR
              </div>
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ padding: '12px 12px 8px' }}>
          <Link to="/learn" style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isActive('/learn') ? '#4ade80' : 'var(--text-secondary)',
                background: isActive('/learn') ? 'rgba(74,222,128,0.08)' : 'transparent',
                transition: 'all var(--transition-fast)',
                border: isActive('/learn') ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent',
              }}
            >
              <BookOpen size={16} />
              Learn Basics
            </div>
          </Link>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive('/') ? 'var(--bg-glass-hover)' : 'transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Home size={16} />
              Home
            </div>
          </Link>
          <Link to="/compare" style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isActive('/compare') ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive('/compare') ? 'var(--bg-glass-hover)' : 'transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <GitCompare size={16} />
              Compare Models
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '4px 12px 12px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search 43 models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                width: '100%',
                padding: '6px 0',
              }}
            />
            {searchQuery && (
              <X 
                size={12} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        </div>

        {/* Model List */}
        <nav style={{ flex: 1, padding: '0 12px 20px', overflowY: 'auto' }}>
          {Object.entries(filteredModelsByEra).map(([era, models]) => {
            const EraIcon = ERA_ICONS[era];
            const eraInfo = ERA_LABELS[era];
            const isCollapsed = collapsed[era];

            return (
              <div key={era} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => toggleEra(era)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: eraInfo.color,
                    background: 'transparent',
                    transition: 'background var(--transition-fast)',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <EraIcon size={14} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{eraInfo.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {eraInfo.period}
                  </span>
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </button>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {models.map(model => (
                        <Link
                          key={model.id}
                          to={`/model/${model.id}`}
                          style={{ textDecoration: 'none' }}
                          onClick={() => setMobileOpen(false)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 12px 6px 36px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.8rem',
                              color: isActive(`/model/${model.id}`) ? 'var(--text-primary)' : 'var(--text-secondary)',
                              background: isActive(`/model/${model.id}`) ? 'var(--bg-glass-hover)' : 'transparent',
                              transition: 'all var(--transition-fast)',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                              if (!isActive(`/model/${model.id}`)) {
                                e.currentTarget.style.background = 'var(--bg-glass)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isActive(`/model/${model.id}`)) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                              }
                            }}
                          >
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                              minWidth: '40px',
                            }}>
                              {model.year}
                            </span>
                            {model.shortName}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
