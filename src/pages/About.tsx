import { FeatureCard } from '../components/FeatureCard';
import { SectionTitle } from '../components/SectionTitle';

const features = [
  ['01', 'Upload', 'A user provides a saree or fabric image through the browser interface.'],
  ['02', 'Visual Feature Extraction', 'The future model would focus on shape, texture, edges, and repeated motif structure.'],
  ['03', 'Design Embedding', 'Extracted visual signals would be represented as a compact searchable vector.'],
  ['04', 'Gallery Matching', 'The system would compare that vector against known textile designs.'],
  ['05', 'Similarity Verification', 'Two designs could be checked against a threshold for same or different pattern behavior.'],
] as const;

export function About() {
  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="AI Method"
        title="How VASTRA VISION Works"
        copy="This frontend explains the intended flow without claiming a specific architecture or real inference result."
      />

      <section className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-5">
        {features.map(([number, title, copy]) => (
          <FeatureCard key={number} number={number} title={title} copy={copy} />
        ))}
      </section>

      <section className="mx-auto mt-12 max-w-4xl rounded border border-gold/25 bg-white p-6 shadow-soft">
        <div className="diagram" aria-label="AI method diagram">
          <DiagramNode label="Image" />
          <DiagramArrow />
          <DiagramNode label="Feature Encoder" />
          <DiagramArrow />
          <DiagramNode label="Visual Embedding" />
          <DiagramArrow />
          <DiagramNode label="Similarity Search" />
          <DiagramArrow />
          <DiagramNode label="Design Match" />
        </div>
        <p className="mt-6 text-sm leading-6 text-ink/65">
          Frontend prototype - real ML inference not connected. The service layer can later call POST /predict, POST
          /verify, and GET /gallery without rewriting page components.
        </p>
      </section>
    </div>
  );
}

function DiagramNode({ label }: { label: string }) {
  return <div className="rounded border border-gold/35 bg-ivory px-4 py-3 text-center text-sm font-semibold text-ink">{label}</div>;
}

function DiagramArrow() {
  return <div className="text-center text-2xl text-gold" aria-hidden="true">↓</div>;
}
