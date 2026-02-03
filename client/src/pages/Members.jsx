import { useEffect, useState } from 'react';
import { getMembers } from '../api/members';
import { Github, Mail } from 'lucide-react';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getMembers();
                setMembers(data);
            } catch (err) {
                console.error("Failed to fetch members:", err);
                setError("Failed to load members.");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const getRoleBadge = (user) => {
        if (user.is_club_admin) {
            return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded font-mono">Admin</span>;
        }
        if (user.is_staff) {
            return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 rounded font-mono">Staff</span>;
        }
        if (user.is_member) {
            return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/50 rounded font-mono">Member</span>;
        }
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-gray-500/20 text-gray-400 border border-gray-500/50 rounded font-mono">User</span>;
    };

    if (loading) return <div className="p-8 text-center text-[#00E0FF] font-mono animate-pulse">LOADING ROSTER...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-mono border border-red-500/30 bg-red-500/10 rounded-lg mx-8">{error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-mono tracking-wider flex items-center gap-3 text-white">
                    <span className="text-[#00E0FF] text-4xl">{`>`}</span>
                    CLUB ROSTER
                </h1>
                <span className="bg-[#00E0FF]/10 text-[#00E0FF] px-4 py-1 rounded border border-[#00E0FF]/30 font-mono text-xs uppercase tracking-widest">
                    {members.length} ACTIVE AGENTS
                </span>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden border border-[#333]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0a0a] border-b border-[#333]">
                            <tr>
                                <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono tracking-wider">AGENT IDENTITY</th>
                                <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono tracking-wider">ROLE & CLEARANCE</th>
                                <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono tracking-wider">BATCH</th>
                                <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono tracking-wider text-right">COMM LINKS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-[#00E0FF]/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded overflow-hidden bg-[#1a1a1a] flex items-center justify-center text-[#00E0FF] font-bold mr-4 border border-[#333] group-hover:border-[#00E0FF] transition-colors">
                                                {member.avatar ? (
                                                    <img src={member.avatar} alt={member.username} className="w-full h-full object-cover filter contrast-125" />
                                                ) : (
                                                    (member.full_name || member.username).charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-200 group-hover:text-white font-mono uppercase tracking-wide transition-colors">
                                                    {member.full_name || member.username}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            {getRoleBadge(member)}
                                            {member.skill_level && (
                                                <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider pl-1 border-l border-gray-700 ml-1">
                                                    {member.skill_level} DEV
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                                        {member.batch_year || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {member.github_username && (
                                                <a
                                                    href={`https://github.com/${member.github_username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                                                    title={`GitHub: ${member.github_username}`}
                                                >
                                                    <Github size={18} />
                                                </a>
                                            )}
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="p-2 text-gray-500 hover:text-[#00E0FF] hover:bg-[#1a1a1a] rounded transition-colors"
                                                title={`Email: ${member.email}`}
                                            >
                                                <Mail size={18} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Members;
