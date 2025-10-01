import React, { useState, Suspense, lazy, useMemo } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import { products } from './data/products.js';
// Skip to content link for accessibility
const SkipToContent = () => (
  <a
    href="#main-content"
    className="skip-link absolute left-2 top-2 z-50 bg-[var(--color-accent)] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
    style={{ position: 'absolute', left: 0, top: 0, transform: 'translateY(-100%)', transition: 'transform 0.2s' }}
    onFocus={e => (e.target.style.transform = 'translateY(0)')}
    onBlur={e => (e.target.style.transform = 'translateY(-100%)')}
  >
    Skip to main content
  </a>
);
const Hero = lazy(() => import('./Hero'));
import StructuredData from './StructuredData';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';


function App() {
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), []);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const filtered = useMemo(() => products.filter(p => p.category === selectedCategory), [selectedCategory]);

  return (
  <div className="min-h-screen w-full m-0 p-0">
      <SkipToContent />
      <Navbar />
      <Suspense fallback={<div style={{height:'420px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#6f4e37'}}>Loading hero…</div>}>
        <Hero />
      </Suspense>
      <StructuredData />
  <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      <main id="main-content">
  <ProductGrid products={filtered} title={`Our ${selectedCategory}`} category={selectedCategory} />
      </main>
  <Footer />
    </div>
  );
}

export default App; 
