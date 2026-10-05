interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  copy?: string;
}

export function SectionTitle({ eyebrow, title, copy }: SectionTitleProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
      {copy ? <p className="mt-4 text-base leading-7 text-ink/70 sm:text-lg">{copy}</p> : null}
    </div>
  );
}
