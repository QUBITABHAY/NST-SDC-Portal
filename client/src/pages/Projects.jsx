import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../api/projects';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="p-8 text-center text-[#00E0FF] font-mono animate-pulse">LOADING MISSION DATA...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-mono border border-red-500/30 bg-red-500/10 rounded-lg mx-8">{error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-full">
            <h1 className="text-3xl font-bold font-mono tracking-wider flex items-center gap-3 text-white mb-8">
                <span className="text-[#00E0FF] text-4xl">{`>`}</span>
                ACTIVE MISSIONS
            </h1>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 text-gray-500 border border-dashed border-[#333] rounded-lg bg-[#0a0a0a]">
                    <p className="text-xl font-mono uppercase tracking-widest">NO ACTIVE MISSIONS FOUND.</p>
                </div>
            )}
        </div>
    );
};

export default Projects;
