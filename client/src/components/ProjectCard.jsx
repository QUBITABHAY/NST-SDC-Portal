import { Github } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const badgeColors = {
        contributor: 'bg-[--color-badge-contributor] text-gray-800',
        maintainer: 'bg-[--color-badge-maintainer] text-gray-800'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Header with Project Name and Badge */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${badgeColors[project.role]}`}>
                    {project.role}
                </span>
            </div>

            {/* Members */}
            <div className="mb-4">
                <p className="text-gray-500 text-sm mb-1">Members:</p>
                <div className="flex flex-wrap gap-1 text-gray-700 font-medium">
                    {project.members.map((member, index) => (
                        <span key={index}>
                            <a
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 hover:underline transition-colors"
                            >
                                {member.name}
                            </a>
                            {index < project.members.length - 1 && <span>, </span>}
                        </span>
                    ))}
                </div>
            </div>

            {/* Recent Commits */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">{project.recentCommits}</p>
            </div>

            {/* GitHub Link */}
            <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
                <Github size={18} />
                <span className="text-sm font-medium">Visit on Github</span>
            </a>
        </div>
    );
};

export default ProjectCard;
