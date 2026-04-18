import { ExternalLink, BookOpen } from 'lucide-react';

/**
 * Styled paper link card with title, authors, year, and venue.
 */
export default function PaperLink({ paper }) {
  if (!paper) return null;

  const content = (
    <div className="paper-card">
      <div className="paper-card__icon">
        <BookOpen size={22} />
      </div>
      <div className="paper-card__info">
        <div className="paper-card__title">
          {paper.title}
        </div>
        <div className="paper-card__meta">
          {paper.authors} · {paper.year} · {paper.venue}
        </div>
      </div>
      {paper.url && <ExternalLink size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />}
    </div>
  );

  if (paper.url) {
    return (
      <a href={paper.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {content}
      </a>
    );
  }

  return content;
}
