import { hasLocalDataset, galleryImages } from '../data/gallery';
import type { PageKey } from '../types';
import { TextilePatternBackground } from '../components/TextilePatternBackground';

interface HomeProps {
  navigate: (page: PageKey) => void;
}

export function Home({ navigate }: HomeProps) {
  const collage = galleryImages.slice(0, 8);

  return (
    <TextilePatternBackground className="relative">
      <div className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="fade-in">
          <p className="section-eyebrow">Indian textile intelligence</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl lg:text-7xl">
            Recognizing the design beyond the color.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
            An AI-powered visual system for discovering and comparing Indian textile patterns.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-primary justify-center" onClick={() => navigate('identify')}>
              Identify a Design
            </button>
            <button className="btn btn-secondary justify-center" onClick={() => navigate('verify')}>
              Compare Two Designs
            </button>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-ink/55">
            Prototype Demonstration: demo similarity is deterministic and prepared for a future trained model backend.
          </p>
        </section>

        <section className="fade-in-delay" aria-label="Textile image collage">
          {hasLocalDataset ? (
            <div className="collage">
              {collage.map((image, index) => (
                <img
                  key={image.id}
                  src={image.src}
                  alt={`${image.category} textile`}
                  className={`collage-img collage-img-${(index % 4) + 1}`}
                  loading={index < 4 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          ) : (
            <div className="rounded border border-gold/30 bg-white/80 p-8 shadow-soft">
              <p className="font-serif text-3xl text-ink">Dataset images are not available yet.</p>
              <p className="mt-4 leading-7 text-ink/65">
                Add image folders at <span className="font-mono text-sm">src/assets/dataset/Banarasi</span>,{' '}
                <span className="font-mono text-sm">Bandhani</span>, <span className="font-mono text-sm">Ikat</span>, and{' '}
                <span className="font-mono text-sm">Pichwai</span>. VASTRA VISION will automatically discover them.
              </p>
            </div>
          )}
        </section>
      </div>
    </TextilePatternBackground>
  );
}
