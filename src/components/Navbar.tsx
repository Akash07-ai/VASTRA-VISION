import { useState } from 'react';
import type { PageKey } from '../types';

interface NavbarProps {
  activePage: PageKey;
  navigate: (page: PageKey) => void;
}

const navItems: Array<{ key: PageKey; label: string }> = [
  { key: 'home', label: 'Home' },
  { key: 'identify', label: 'Identify' },
  { key: 'verify', label: 'Verify' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'color', label: 'Color Invariance' },
  { key: 'about', label: 'About' },
];

export function Navbar({ activePage, navigate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const goTo = (page: PageKey) => {
    navigate(page);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ink/95 text-ivory backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          className="text-left focus-ring"
          onClick={() => goTo('home')}
          aria-label="Go to VASTRA VISION home"
        >
          <span className="block font-serif text-xl font-semibold tracking-wide text-gold">VASTRA VISION</span>
          <span className="text-xs text-ivory/65">Design beyond color</span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-link ${activePage === item.key ? 'nav-link-active' : ''}`}
              onClick={() => goTo(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="hidden btn btn-primary lg:inline-flex" onClick={() => goTo('identify')}>
          Analyze a Design
        </button>

        <button
          className="focus-ring rounded border border-gold/30 px-3 py-2 text-sm lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          Menu
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" className="border-t border-gold/20 px-4 pb-4 lg:hidden" aria-label="Mobile navigation">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`nav-link text-left ${activePage === item.key ? 'nav-link-active' : ''}`}
                onClick={() => goTo(item.key)}
              >
                {item.label}
              </button>
            ))}
            <button className="btn btn-primary mt-2 justify-center" onClick={() => goTo('identify')}>
              Analyze a Design
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
