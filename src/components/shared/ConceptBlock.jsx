/**
 * Concept explanation block with icon, title, and description.
 */
export default function ConceptBlock({ concepts, eraColor }) {
  return (
    <div className="concept-grid">
      {concepts.map((concept, i) => (
        <div className="concept-block" key={i}>
          <div
            className="concept-block__icon"
            style={{
              background: eraColor ? `${eraColor}10` : 'var(--bg-glass)',
              border: eraColor ? `1px solid ${eraColor}30` : '1px solid var(--border-subtle)',
            }}
          >
            {concept.icon}
          </div>
          <div className="concept-block__title">{concept.title}</div>
          <div className="concept-block__text">{concept.text}</div>
        </div>
      ))}
    </div>
  );
}
