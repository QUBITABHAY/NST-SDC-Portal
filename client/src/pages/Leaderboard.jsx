import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/leaderboard';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [period, setPeriod] = useState('all_time');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getLeaderboard(period);
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Failed to load leaderboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [period]);

    const filters = [
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'all_time', label: 'All Time' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-mono tracking-wider flex items-center gap-3 text-white">
                    <span className="text-[#00E0FF] text-4xl">{`#`}</span>
                    TOP AGENTS
                </h1>

                {/* Filter Tabs */}
                <div className="flex bg-[#0a0a0a] p-1 rounded-lg border border-[#333]">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setPeriod(filter.id)}
                            className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${period === filter.id
                                ? 'bg-[#00E0FF]/10 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.1)] border border-[#00E0FF]/30'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-[#00E0FF] font-mono animate-pulse">CALCULATING RANKINGS...</div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 font-mono border border-red-500/30 bg-red-500/10 rounded-lg">{error}</div>
            ) : (
                <div className="glass-panel rounded-xl overflow-hidden border border-[#333] flex-1 flex flex-col">
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-[#0a0a0a] border-b border-[#333] sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono w-24 text-center tracking-wider">RANK</th>
                                    <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono tracking-wider">AGENT IDENTITY</th>
                                    <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono tracking-wider">BATCH</th>
                                    <th className="px-6 py-4 font-bold text-[#00E0FF] font-mono text-right tracking-wider">SCORE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f1f]">
                                {users.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-[#00E0FF]/5 transition-colors group">
                                        <td className="px-6 py-4 text-center">
                                            {user.rank <= 3 ? (
                                                <div className="relative flex items-center justify-center">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold font-mono border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${user.rank === 1 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 shadow-yellow-500/20' :
                                                            user.rank === 2 ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/50 shadow-cyan-400/20' :
                                                                'bg-orange-500/10 text-orange-500 border-orange-500/50 shadow-orange-500/20'
                                                        }`}>
                                                        {user.rank}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 font-mono font-bold text-lg">#{user.rank}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded overflow-hidden flex items-center justify-center mr-4 border-2 transition-transform group-hover:scale-110 ${user.rank === 1 ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                                                        user.rank === 2 ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]' :
                                                            user.rank === 3 ? 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' :
                                                                'border-[#333] group-hover:border-[#00E0FF]/50'
                                                    }`}>
                                                    <img
                                                        src={user.avatar || (user.github_username ? `https://github.com/${user.github_username}.png` : `https://ui-avatars.com/api/?name=${user.full_name || user.username}&background=random`)}
                                                        alt={user.username}
                                                        className="w-full h-full object-cover filter contrast-125"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-200 group-hover:text-white font-mono uppercase tracking-wide">
                                                        {user.full_name || user.username}
                                                        {user.id === users[0]?.id && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-1 rounded animate-pulse">MVP</span>}
                                                    </div>
                                                    <div className="text-xs text-[#00E0FF]/70 font-mono">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-[#1a1a1a] border border-[#333] text-gray-400 text-xs font-mono">
                                                {user.batch_year || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-[#00E0FF] text-xl font-mono tracking-widest text-shadow-neon">{user.points}</span>
                                            <span className="text-gray-600 text-[10px] ml-1 uppercase font-mono">XP</span>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-20">
                                            <p className="text-gray-600 font-mono mb-2">NO DATA SIGNALS DETECTED.</p>
                                            <p className="text-gray-700 text-xs font-mono">Ensure period selection covers active timeline.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;

