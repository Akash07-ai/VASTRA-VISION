interface FeatureCardProps {
  number: string;
  title: string;
  copy: string;
}

export function FeatureCard({ number, title, copy }: FeatureCardProps) {
  return (
    <article className="card p-5">
      <p className="font-serif text-3xl text-gold">{number}</p>
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/65">{copy}</p>
    </article>
  );
}
