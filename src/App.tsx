import { useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { IdentifyDesign } from './pages/IdentifyDesign';
import { VerifyDesign } from './pages/VerifyDesign';
import { Gallery } from './pages/Gallery';
import { ColorInvariance } from './pages/ColorInvariance';
import { About } from './pages/About';
import type { PageKey, TextileImage } from './types';

function App() {
  const [page, setPage] = useState<PageKey>('home');
  const [findSimilarImage, setFindSimilarImage] = useState<TextileImage | null>(null);

  const navigate = (p: PageKey) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFindSimilar = (image: TextileImage) => {
    setFindSimilarImage(image);
    navigate('identify');
  };

  const currentPage = useMemo(() => {
    if (page === 'identify') return <IdentifyDesign initialImage={findSimilarImage} />;
    if (page === 'verify') return <VerifyDesign />;
    if (page === 'gallery') return <Gallery onFindSimilar={handleFindSimilar} />;
    if (page === 'color') return <ColorInvariance />;
    if (page === 'about') return <About />;
    return <Home navigate={navigate} />;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, findSimilarImage]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-ivory text-ink">
      <Navbar activePage={page} navigate={navigate} />
      <main>{currentPage}</main>
      <Footer />
    </div>
  );
}

export default App;
