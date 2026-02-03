import { Github } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const badgeColors = {
        planning: 'bg-blue-200 text-blue-800',
        in_progress: 'bg-[#7FFF7F] text-gray-800',
        completed: 'bg-[#FFD700] text-gray-800',
        archived: 'bg-gray-300 text-gray-800'
    };

    return (
        <div className="bg-gray-50 rounded-lg border-t-4 border-t-[#00CED1] shadow-sm p-5 hover:shadow-md transition-all">
            {/* Header: Project Name and Badge */}
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>

                {/* Status Badge */}
                <span className={`px-5 py-2 rounded-full text-base font-bold border-2 border-black shadow-lg ${badgeColors[project.status] || 'bg-gray-200'}`}>
                    {project.status_display || project.status}
                </span>
            </div>

            {/* Team Lead */}
            {project.lead_details && (
                <div className="mb-1.5">
                    <span className="text-gray-400 text-sm font-bold">Team lead: </span>
                    <span className="text-[#00CED1] text-sm font-bold">
                        {project.lead_details.full_name || project.lead_details.username}
                    </span>
                </div>
            )}

            {/* Description */}
            <div className="mb-4 text-gray-600">
                {project.description}
            </div>

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mb-4">
                    <span className="text-gray-400 text-sm font-bold">Tech Stack: </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {project.tech_stack.map((tech, index) => (
                            <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Members */}
            {project.contributors_details && project.contributors_details.length > 0 && (
                <div className="mb-4">
                    <span className="text-gray-400 text-sm font-bold">Members: </span>
                    {project.contributors_details.map((member, index) => (
                        <span key={index}>
                            <span className="text-[#00CED1] text-sm font-bold">
                                {member.full_name || member.username}
                            </span>
                            {index < project.contributors_details.length - 1 && <span className="text-gray-400 text-sm font-bold">, </span>}
                        </span>
                    ))}
                </div>
            )}

            {/* GitHub Link */}
            {project.github_repo && (
                <div className="text-right pt-2 border-t border-gray-200">
                    <a
                        href={project.github_repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 text-sm font-bold inline-block"
                    >
                        Visit on Github
                    </a>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
