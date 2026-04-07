import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, Layers, Tag, Sparkles, Terminal } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, type ProjectScreenshot } from '../data/projects';

// Lightbox Component
function Lightbox({ 
  screenshots, 
  currentIndex, 
  onClose, 
  onPrev, 
  onNext 
}: {
  screenshots: ProjectScreenshot[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full bg-white/10 text-sm text-white font-medium">
        {currentIndex + 1} / {screenshots.length}
      </div>

      {/* Category badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 text-sm text-slate-300 font-medium">
        {screenshots[currentIndex]?.category}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={screenshots[currentIndex]?.src}
          alt={screenshots[currentIndex]?.caption}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </motion.div>
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = getProjectById(id || '');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <button onClick={() => navigate('/')} className="text-violet-400 hover:text-violet-300 transition-colors">
            ← Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(project.screenshots.map(s => s.category)))];
  const filteredScreenshots = activeCategory === 'All'
    ? project.screenshots
    : project.screenshots.filter(s => s.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredScreenshots.length - 1 : lightboxIndex - 1);
    }
  };
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredScreenshots.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 font-sans selection:bg-violet-500/30 overflow-x-hidden" ref={topRef}>
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br ${project.color} rounded-full blur-[200px] opacity-[0.04]`} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Back to Portfolio</span>
          </motion.button>

          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tighter text-white flex items-center gap-2"
          >
            <Terminal className="w-5 h-5 text-violet-500" />
            MAS.
          </motion.span>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Role badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8`}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: project.accentColor }} />
                <span style={{ color: project.accentColor }}>{project.role}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                {project.title}
              </h1>
            </motion.div>

            {/* Info Grid */}
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 mt-12">
              {/* Description - Left Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-3"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">About this Project</h2>
                <div className="text-lg text-slate-400 leading-relaxed whitespace-pre-line font-light">
                  {project.longDescription}
                </div>
              </motion.div>

              {/* Sidebar - Right Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 space-y-10"
              >
                {/* Tech Stack */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Tag className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Tech Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-slate-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Key Features</h3>
                  </div>
                  <ul className="space-y-3">
                    {project.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + j * 0.05 }}
                        className="flex items-start gap-3 text-slate-300 text-[15px]"
                      >
                        <div
                          className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: project.accentColor }}
                        />
                        <span className="leading-relaxed">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Screenshots Gallery */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Screenshots</h2>
              <p className="text-slate-500 text-lg">Explore the application's interface and features</p>
            </motion.div>

            {/* Category Tabs */}
            {categories.length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap gap-2 mb-10"
              >
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-white/10 text-white border border-white/20 shadow-lg'
                        : 'bg-white/[0.02] text-slate-500 border border-white/[0.06] hover:bg-white/[0.05] hover:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Gallery Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredScreenshots.map((screenshot, index) => (
                  <motion.div
                    key={screenshot.src}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    onClick={() => openLightbox(index)}
                    className="group relative cursor-pointer rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={screenshot.src}
                        alt={screenshot.caption}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-medium text-white/80 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                          {screenshot.category}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <ZoomIn className="w-4 h-4 text-white/80" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredScreenshots.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No screenshots available for this category.
              </div>
            )}
          </div>
        </section>

        {/* Back to Projects CTA */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/#projects')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Projects
            </motion.button>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5 relative z-10 bg-[#030014]">
        <p>Designed & Built by <span className="text-slate-300 font-medium">Marc Angelo Soria</span></p>
        <p className="mt-2 opacity-60">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            screenshots={filteredScreenshots}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
