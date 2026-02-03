import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Edit, Trash2, Plus, Github, ExternalLink } from 'lucide-react';

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'planning',
        repo_url: '',
        demo_url: '',
        lead_id: ''
    });

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await api.get('/projects/');
            setProjects(response.data.results || response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/');
            setUsers(response.data.results || response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = () => {
        setSelectedProject(null);
        setFormData({
            name: '',
            description: '',
            status: 'planning',
            repo_url: '',
            demo_url: '',
            lead_id: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            status: project.status,
            repo_url: project.github_repo || '',
            demo_url: project.demo_url || '',
            lead_id: project.lead || '' // Adjust based on serializer (id vs object)
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await api.delete(`/projects/${id}/`);
            fetchProjects();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                status: formData.status,
                github_repo: formData.repo_url,
                demo_url: formData.demo_url,
                lead: formData.lead_id ? formData.lead_id : null
            };

            if (selectedProject) {
                await api.patch(`/projects/${selectedProject.id}/`, payload);
            } else {
                await api.post('/projects/', payload);
            }
            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            alert("Operation failed");
        }
    };

    return (
        <div className="font-mono">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wider">
                    <span className="text-[#00E0FF]">{`>`}</span> PROJECT_OPS
                </h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/50 px-4 py-2 rounded hover:bg-[#00E0FF]/20 hover:shadow-[0_0_15px_rgba(0,224,255,0.2)] transition-all font-bold tracking-wider text-sm"
                >
                    <Plus size={16} /> NEW_OPERATION
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-[#00E0FF] animate-pulse">Scanning Project Database...</div>
            ) : (
                <div className="grid gap-4">
                    {projects.map(project => (
                        <div key={project.id} className="bg-[#050505] border border-[#333] rounded-lg p-5 flex justify-between items-start hover:border-[#00E0FF]/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,224,255,0.05)]">
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-[#00E0FF] transition-colors tracking-wide uppercase">{project.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-3 max-w-2xl font-sans">{project.description}</p>
                                <div className="flex gap-3 text-xs font-mono">
                                    <span className={`px-2 py-1 rounded border capitalize tracking-wide font-bold flex items-center
                                        ${project.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                            project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                                'bg-gray-500/10 text-gray-400 border-gray-500/30'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${project.status === 'completed' ? 'bg-green-400 shadow-[0_0_5px_#4ade80]' :
                                                project.status === 'in_progress' ? 'bg-blue-400 shadow-[0_0_5px_#60a5fa]' :
                                                    'bg-gray-400'
                                            }`}></div>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                    {project.github_repo && (
                                        <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 text-gray-400 border border-[#333] bg-[#1a1a1a] rounded hover:text-white hover:border-gray-500 transition-colors">
                                            <Github size={12} /> REPO_LINK
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(project)} className="p-1.5 text-[#00E0FF] hover:bg-[#00E0FF]/10 rounded border border-transparent hover:border-[#00E0FF]/30 transition-all">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-xl border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#333] bg-[#111] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
                                {selectedProject ? 'Modify Operation' : 'Launch New Operation'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Project Codename</label>
                                <input
                                    type="text" placeholder="Name" value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all" required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Objective Description</label>
                                <textarea
                                    placeholder="Description" value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] h-24 transition-all" required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Operational Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                    >
                                        <option value="planning">PLANNING</option>
                                        <option value="in_progress">ACTIVE</option>
                                        <option value="completed">COMPLETED</option>
                                        <option value="archived">ARCHIVED</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Project Lead</label>
                                    <select
                                        value={formData.lead_id}
                                        onChange={e => setFormData({ ...formData, lead_id: e.target.value })}
                                        className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                    >
                                        <option value="">-- ASSIGN AGENT --</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Source Code Repository</label>
                                <input
                                    type="url" placeholder="GitHub Repo URL" value={formData.repo_url}
                                    onChange={e => setFormData({ ...formData, repo_url: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded transition-all text-sm font-bold uppercase tracking-wider">Abort</button>
                                <button type="submit" className="px-6 py-2 bg-[#00E0FF] text-black font-bold rounded shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:bg-[#33eaff] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] transition-all text-sm uppercase tracking-wider">Execute</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManagement;
