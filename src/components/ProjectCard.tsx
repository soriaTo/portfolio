import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProjectData } from '../data/projects';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onClick={() => navigate(`/project/${project.id}`)}
      className="group relative cursor-pointer"
    >
      {/* Card */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-[0_8px_60px_-12px_rgba(139,92,246,0.15)] overflow-hidden">
        
        {/* Subtle gradient glow on hover */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${project.color} rounded-full blur-[80px] opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700`} />
        
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300 leading-tight">
              {project.title}
            </h3>
          </div>
          
          {/* Arrow Icon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-white/[0.15] transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
        </div>
        
        {/* Description */}
        <p className="text-[15px] text-slate-400 leading-relaxed mb-8 line-clamp-3 group-hover:text-slate-300 transition-colors duration-300">
          {project.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-semibold tracking-wider uppercase text-slate-500 group-hover:text-slate-400 group-hover:border-white/[0.12] transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom gradient line on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
      </div>
    </motion.div>
  );
}
