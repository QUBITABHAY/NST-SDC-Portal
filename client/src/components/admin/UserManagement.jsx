import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Edit, Trash2, UserPlus, Check, X } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        is_club_admin: false,
        is_member: true,
        password: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/', { params: { search } });
            setUsers(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setFormData({
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            is_club_admin: false,
            is_member: true,
            password: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_club_admin: user.is_club_admin,
            is_member: user.is_member,
            password: '' // Don't fill password
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}/`);
            fetchUsers();
            alert("User deleted successfully");
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                // Remove password if empty to avoid updating it
                const data = { ...formData };
                if (!data.password) delete data.password;

                await api.patch(`/users/${selectedUser.id}/`, data);
                alert("User updated successfully");
            } else {
                await api.post('/users/', formData);
                alert("User created successfully");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Operation failed", error);
            alert("Operation failed check console");
        }
    };

    return (
        <div className="font-mono">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="SEARCH_AGENTS::"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#050505] border border-[#333] rounded text-[#00E0FF] focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.2)] placeholder-gray-600 transition-all font-mono text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/50 px-4 py-2 rounded hover:bg-[#00E0FF]/20 hover:shadow-[0_0_15px_rgba(0,224,255,0.2)] transition-all font-bold tracking-wider text-sm"
                >
                    <UserPlus size={16} /> RECRUIT_AGENT
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-[#00E0FF] animate-pulse">Scanning Database...</div>
            ) : (
                <div className="overflow-x-auto border border-[#333] rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] border-b border-[#333]">
                                <th className="p-4 text-xs font-bold text-[#00E0FF] uppercase tracking-widest">Agent Identity</th>
                                <th className="p-4 text-xs font-bold text-[#00E0FF] uppercase tracking-widest">Comms</th>
                                <th className="p-4 text-xs font-bold text-[#00E0FF] uppercase tracking-widest">Clearance</th>
                                <th className="p-4 text-xs font-bold text-[#00E0FF] uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-[#00E0FF]/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-white group-hover:text-[#00E0FF] transition-colors">{user.username}</div>
                                        <div className="text-xs text-gray-500 font-sans">{user.first_name} {user.last_name}</div>
                                    </td>
                                    <td className="p-4 text-gray-400 font-sans text-sm">{user.email}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {user.is_club_admin ? (
                                                <span className="px-2 py-0.5 text-[10px] font-bold text-purple-400 bg-purple-500/20 border border-purple-500/50 rounded shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                                    ADMIN
                                                </span>
                                            ) : user.is_member ? (
                                                <span className="px-2 py-0.5 text-[10px] font-bold text-green-400 bg-green-500/20 border border-green-500/50 rounded shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                                    OPERATIVE
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] font-bold text-gray-400 bg-gray-500/20 border border-gray-500/50 rounded">
                                                    USER
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-1.5 text-[#00E0FF] hover:bg-[#00E0FF]/10 rounded border border-transparent hover:border-[#00E0FF]/30 transition-all"
                                                title="Edit Protocol"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-all"
                                                title="Terminate Agent"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-xl border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#333] bg-[#111] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
                                {selectedUser ? 'Update Clearance' : 'New Agent Protocol'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Codename (Username)</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Comms Link (Email)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                    />
                                </div>
                            </div>
                            {!selectedUser && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Access Key (Password)</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                        required={!selectedUser}
                                    />
                                </div>
                            )}

                            <div className="pt-2 flex gap-6 border-t border-[#333] mt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.is_member ? 'bg-[#00E0FF] border-[#00E0FF] shadow-[0_0_10px_#00E0FF]' : 'border-gray-500 bg-transparent'}`}>
                                        {formData.is_member && <Check size={12} className="text-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_member}
                                        onChange={(e) => setFormData({ ...formData, is_member: e.target.checked })}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Grant Operative Status</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.is_club_admin ? 'bg-purple-500 border-purple-500 shadow-[0_0_10px_#a855f7]' : 'border-gray-500 bg-transparent'}`}>
                                        {formData.is_club_admin && <Check size={12} className="text-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_club_admin}
                                        onChange={(e) => setFormData({ ...formData, is_club_admin: e.target.checked })}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Grant Admin Clearance</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded transition-all text-sm font-bold uppercase tracking-wider"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#00E0FF] text-black font-bold rounded shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:bg-[#33eaff] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] transition-all text-sm uppercase tracking-wider"
                                >
                                    {selectedUser ? 'Update Identity' : 'Initialize Agent'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
