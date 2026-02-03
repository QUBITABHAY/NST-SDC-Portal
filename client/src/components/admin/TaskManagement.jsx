import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Edit, Trash2, Plus, CheckCircle } from 'lucide-react';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        points: 10,
        due_date: ''
    });

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tasks/');
            setTasks(response.data.results || response.data);
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
        setSelectedTask(null);
        setFormData({ title: '', description: '', assigned_to: '', points: 10, due_date: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            assigned_to: task.assigned_to?.id || task.assigned_to, // Handle expand vs id
            points: task.points,
            due_date: task.due_date ? task.due_date.slice(0, 16) : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete task?")) return;
        try {
            await api.delete(`/tasks/${id}/`);
            fetchTasks();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const handleVerify = async (id) => {
        try {
            await api.post(`/tasks/${id}/verify/`);
            fetchTasks();
        } catch (error) {
            alert("Verification failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTask) {
                await api.patch(`/tasks/${selectedTask.id}/`, formData);
            } else {
                await api.post('/tasks/', formData);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            alert("Operation failed");
        }
    };

    return (
        <div className="font-mono">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wider">
                    <span className="text-[#00E0FF]">{`>`}</span> PROTOCOLS
                </h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/50 px-4 py-2 rounded hover:bg-[#00E0FF]/20 hover:shadow-[0_0_15px_rgba(0,224,255,0.2)] transition-all font-bold tracking-wider text-sm"
                >
                    <Plus size={16} /> ASSIGN_PROTOCOL
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-[#00E0FF] animate-pulse">Scanning Protocols...</div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-[#050505] border border-[#333] rounded-lg p-4 flex justify-between items-center hover:border-[#00E0FF]/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,224,255,0.05)]">
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-[#00E0FF] transition-colors tracking-wide uppercase">{task.title}</h3>
                                <p className="text-sm text-gray-500 font-mono mt-1">ASSIGNED_TO:: <span className="text-gray-300">{task.assigned_to?.username || 'UNKNOWN'}</span></p>
                                <div className="flex gap-4 mt-2 text-xs font-mono">
                                    <span className={`px-2 py-0.5 rounded border capitalize tracking-wide font-bold flex items-center
                                        ${task.status === 'verified' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                            task.status === 'submitted' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                                'bg-gray-500/10 text-gray-400 border-gray-500/30'
                                        }`}>
                                        {task.status}
                                    </span>
                                    <span className="text-[#00E0FF] flex items-center gap-1">
                                        [{task.points} PTS]
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                {task.status === 'submitted' && (
                                    <button
                                        onClick={() => handleVerify(task.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded border border-green-500/30 transition-all uppercase tracking-wider"
                                    >
                                        <CheckCircle size={14} /> Verify
                                    </button>
                                )}
                                <button onClick={() => handleEdit(task)} className="p-1.5 text-[#00E0FF] hover:bg-[#00E0FF]/10 rounded border border-transparent hover:border-[#00E0FF]/30 transition-all">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(task.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-all">
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
                                {selectedTask ? 'Update Protocol' : 'New Protocol'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Protocol Title</label>
                                <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Protocol Details</label>
                                <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] h-24 transition-all" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Assign Operative</label>
                                <select value={formData.assigned_to} onChange={e => setFormData({ ...formData, assigned_to: e.target.value })} className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all" required>
                                    <option value="">-- SELECT AGENT --</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Reward Points</label>
                                    <input type="number" placeholder="Points" value={formData.points} onChange={e => setFormData({ ...formData, points: e.target.value })} className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Deadline</label>
                                    <input type="datetime-local" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all [color-scheme:dark]" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded transition-all text-sm font-bold uppercase tracking-wider">Abort</button>
                                <button type="submit" className="px-6 py-2 bg-[#00E0FF] text-black font-bold rounded shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:bg-[#33eaff] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] transition-all text-sm uppercase tracking-wider">Initiate</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;
