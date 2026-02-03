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

    if (loading) return <div className="p-8">Loading projects...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Projects</h1>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                    <p className="text-xl">No active projects found.</p>
                </div>
            )}
        </div>
    );
};

export default Projects;
