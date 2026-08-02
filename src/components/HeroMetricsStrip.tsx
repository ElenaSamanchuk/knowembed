const METRICS = [
  '3 steps to embed',
  '12 automated tests',
  'Shadow DOM · no CSS conflicts',
  'RAG over your docs',
] as const;

export function HeroMetricsStrip() {
  return (
    <ul className="hero-metrics" aria-label="Product highlights">
      {METRICS.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
