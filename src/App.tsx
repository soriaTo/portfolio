import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Sparkles,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { 
  SiHtml5, 
  SiCss, 
  SiJavascript, 
  SiReact, 
  SiPhp, 
  SiNodedotjs, 
  SiExpress, 
  SiMysql, 
  SiPostgresql, 
  SiSupabase 
} from 'react-icons/si';
import ProjectCard from './components/ProjectCard';
import { PROJECTS } from './data/projects';

const TECH_STACK = [
  { name: 'HTML5', category: 'Frontend', icon: SiHtml5 },
  { name: 'CSS3', category: 'Frontend', icon: SiCss },
  { name: 'Vanilla JS', category: 'Frontend', icon: SiJavascript },
  { name: 'React', category: 'Frontend', icon: SiReact },
  { name: 'PHP', category: 'Backend', icon: SiPhp },
  { name: 'Node.js', category: 'Backend', icon: SiNodedotjs },
  { name: 'Express.js', category: 'Backend', icon: SiExpress },
  { name: 'MySQL', category: 'Database', icon: SiMysql },
  { name: 'PostgreSQL', category: 'Database', icon: SiPostgresql },
  { name: 'Supabase', category: 'Database', icon: SiSupabase },
];

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

// Interactive Background Glow
const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      animate={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.07), transparent 80%)`,
      }}
    />
  );
};

// Hook to track which section is currently in view
function useActiveSection() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(item => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return activeSection;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const activeSection = useActiveSection();
  const [flashSection, setFlashSection] = useState<string | null>(null);
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Smooth scroll to section with a subtle flash highlight
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Trigger flash animation on the target section
    setFlashSection(id);
    setTimeout(() => setFlashSection(null), 1200);

    const navHeight = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      <MouseGlow />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#030014]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            <Terminal className="w-5 h-5 text-violet-500" />
            MAS.
          </motion.span>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex gap-1 text-sm font-medium"
          >
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                ref={el => { navRefs.current[item.id] = el; }}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 rounded-lg transition-colors duration-300 ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </nav>

      {/* Section flash overlay — a brief glow when nav is clicked */}
      <AnimatePresence>
        {flashSection && (
          <motion.div
            key={flashSection}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-violet-500/[0.04] to-transparent"
          />
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden" id="home">
          {/* Abstract Background Elements */}
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] mix-blend-screen" />
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] mix-blend-screen" />
          
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                Available for Freelance Opportunities
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.1]"
              >
                Hi, I'm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                  Marc Angelo Soria.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-light"
              >
                A passionate <strong className="text-white font-medium">Full-Stack Developer</strong> crafting robust, scalable, and aesthetic digital experiences from front to back.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-6"
              >
                <a href="#projects" className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold overflow-hidden transition-transform hover:scale-105 active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    View My Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                <a href="#contact" className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10 hover:border-white/20 flex items-center gap-2 backdrop-blur-sm">
                  <Mail className="w-4 h-4" />
                  Contact Me
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-6 relative bg-white/[0.01] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Me</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full mb-10" />
                
                <div className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
                  <p>
                    I am a <strong className="text-white font-medium">Full-Stack Developer</strong> with a deep passion for backend architecture rather than frontend. While I enjoy crafting intuitive user interfaces, my true expertise lies in designing robust databases, building secure APIs, and solving complex business logic behind the scenes.
                  </p>
                  <p>
                    Currently, I am pursuing my <strong className="text-white font-medium">Bachelor of Science in Information Technology (BSIT)</strong> (2023 - Present). My academic journey continuously fuels my drive to learn modern technologies and apply theoretical concepts to real-world applications.
                  </p>
                  <p>
                    My core value proposition is delivering <strong className="text-white font-medium">scalable, secure, and maintainable systems</strong>. Whether it's optimizing complex SQL queries, implementing strict Role-Based Access Control (RBAC), or ensuring seamless third-party integrations, I focus on building digital foundations that businesses can rely on to grow and succeed.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 opacity-50" />
                <div className="relative h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="ml-4 text-xs text-slate-500 font-mono">developer_profile.ts</span>
                </div>
                <div className="relative p-6 md:p-8 font-mono text-sm md:text-base text-slate-300 space-y-4 overflow-x-auto">
                  <div><span className="text-violet-400">const</span> <span className="text-cyan-400">developer</span> = {'{'}</div>
                  <div className="pl-4 md:pl-8">name: <span className="text-green-400">'Marc Angelo Soria'</span>,</div>
                  <div className="pl-4 md:pl-8">role: <span className="text-green-400">'Full-Stack Developer'</span>,</div>
                  <div className="pl-4 md:pl-8">focus: <span className="text-green-400">'Backend Architecture'</span>,</div>
                  <div className="pl-4 md:pl-8">education: <span className="text-green-400">'BSIT (2023-Present)'</span>,</div>
                  <div className="pl-4 md:pl-8">skills: [<span className="text-green-400">'API Design'</span>, <span className="text-green-400">'Database Optimization'</span>, <span className="text-green-400">'System Security'</span>]</div>
                  <div>{'}'};</div>
                  <br/>
                  <div><span className="text-violet-400">await</span> developer.<span className="text-cyan-400">buildScalableSystem</span>();</div>
                  <div className="text-slate-500 animate-pulse mt-2">_</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 md:mb-24"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Technical Arsenal</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {TECH_STACK.map((tech, i) => (
                <motion.div 
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-violet-500/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-8 h-8 text-slate-500 group-hover:text-violet-400 transition-colors mb-4">
                    <tech.icon size="100%" />
                  </div>
                  <div className="text-slate-500 text-xs font-medium tracking-wider uppercase mb-1">{tech.category}</div>
                  <div className="font-semibold text-slate-200 text-lg">{tech.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6 relative bg-white/[0.01] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 md:mb-24"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Featured Projects</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full mb-6" />
              <p className="text-lg text-slate-500 max-w-2xl font-light">
                A selection of projects I've built — click any card to explore screenshots and full details.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {PROJECTS.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/10" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 md:p-20 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Let's build the future.</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
                Whether you have a project in mind, need a freelance developer, or just want to connect, my inbox is always open.
              </p>
              
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:marcangelosoria335@gmail.com" 
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.7)] transition-shadow"
              >
                <Mail className="w-6 h-6" />
                Say Hello
              </motion.a>
              
              <div className="flex justify-center gap-8 mt-20">
                <a href="#" className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:-translate-y-1">
                  <Github className="w-6 h-6" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a href="#" className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:-translate-y-1">
                  <Linkedin className="w-6 h-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5 relative z-10 bg-[#030014]">
        <p>Designed & Built by <span className="text-slate-300 font-medium">Marc Angelo Soria</span></p>
        <p className="mt-2 opacity-60">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}
