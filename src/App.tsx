import { useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { IdentifyDesign } from './pages/IdentifyDesign';
import { VerifyDesign } from './pages/VerifyDesign';
import { Gallery } from './pages/Gallery';
import { ColorInvariance } from './pages/ColorInvariance';
import { About } from './pages/About';
import type { PageKey } from './types';

function App() {
  const [page, setPage] = useState<PageKey>('home');

  const currentPage = useMemo(() => {
    if (page === 'identify') return <IdentifyDesign />;
    if (page === 'verify') return <VerifyDesign />;
    if (page === 'gallery') return <Gallery />;
    if (page === 'color') return <ColorInvariance />;
    if (page === 'about') return <About />;
    return <Home navigate={setPage} />;
  }, [page]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-ivory text-ink">
      <Navbar activePage={page} navigate={setPage} />
      <main>{currentPage}</main>
      <Footer />
    </div>
  );
}

export default App;
