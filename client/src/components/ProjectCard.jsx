import { Github } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const badgeColors = {
        planning: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
        in_progress: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
        completed: 'bg-green-500/10 text-green-500 border-green-500/30',
        archived: 'bg-gray-500/10 text-gray-500 border-gray-500/30'
    };

    return (
        <div className="glass-panel rounded-xl border border-[#333] p-6 hover:border-[#00E0FF]/50 transition-all hover:shadow-[0_0_20px_rgba(0,224,255,0.1)] group relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E0FF] rounded-full blur-[100px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"></div>

            {/* Header: Project Name and Badge */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h2 className="text-2xl font-bold text-white font-mono tracking-wide group-hover:text-[#00E0FF] transition-colors">
                    {project.name}
                </h2>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest font-mono ${badgeColors[project.status] || 'bg-gray-800 text-gray-400'}`}>
                    {project.status_display || project.status}
                </span>
            </div>

            {/* Team Lead */}
            {project.lead_details && (
                <div className="mb-4 flex items-center gap-2 text-xs font-mono relative z-10">
                    <span className="text-gray-500 uppercase tracking-wider">LEAD:</span>
                    <span className="text-[#00E0FF] font-bold">
                        {project.lead_details.full_name || project.lead_details.username}
                    </span>
                </div>
            )}

            {/* Description */}
            <div className="mb-6 text-gray-400 text-sm leading-relaxed font-mono relative z-10 border-l-2 border-[#333] pl-3">
                {project.description}
            </div>

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mb-6 relative z-10">
                    <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest font-mono block mb-2">STACK MATRIX</span>
                    <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech, index) => (
                            <span key={index} className="bg-[#1a1a1a] border border-[#333] px-2 py-1 rounded text-[10px] text-gray-300 font-mono hover:border-[#00E0FF] transition-colors cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer: Members & Link */}
            <div className="pt-4 border-t border-[#333] flex justify-between items-end relative z-10">
                {/* Members */}
                <div className="flex-1 mr-4">
                    {project.contributors_details && project.contributors_details.length > 0 && (
                        <div>
                            <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest font-mono block mb-1">AGENTS</span>
                            <div className="flex flex-wrap gap-1 text-xs font-mono text-gray-400">
                                {project.contributors_details.map((member, index) => (
                                    <span key={index} className="hover:text-white transition-colors">
                                        {member.full_name || member.username}
                                        {index < project.contributors_details.length - 1 && <span className="text-gray-600 mr-1">,</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* GitHub Link */}
                {project.github_repo && (
                    <a
                        href={project.github_repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00E0FF] hover:text-white transition-colors p-2"
                        title="View Source"
                    >
                        <Github size={20} />
                    </a>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
