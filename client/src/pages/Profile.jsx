import { useState, useEffect } from 'react';
import { getProfile, updateProfile, getUserProjects } from '../api/profile';
import { changePassword } from '../api/auth';
import { User, Mail, MapPin, Link as LinkIcon, Github, Linkedin, Calendar, Edit2, Check, X, Code, Briefcase, Lock } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_new_password: '' });
    const [formData, setFormData] = useState({});
    const [githubData, setGithubData] = useState(null);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await getProfile();
                setUser(userData);
                setFormData(userData);

                if (userData.id) {
                    const projectsData = await getUserProjects(userData.id);
                    setProjects(projectsData);
                }

                if (userData.github_username) {
                    fetchGithubDetails(userData.github_username);
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const fetchGithubDetails = async (username) => {
        if (!username) return;
        try {
            const res = await fetch(`https://api.github.com/users/${username}`);
            if (res.ok) {
                const data = await res.json();
                setGithubData(data);
            }
        } catch (err) {
            console.error("Failed to fetch github data", err);
        }
    };

    // Handle Form Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Skills Change (Comma separated)
    const handleSkillsChange = (e) => {
        const skillsString = e.target.value;
        setFormData({ ...formData, tech_skills: skillsString.split(',').map(s => s.trim()) });
    };

    // Helper to ensure URL has protocol
    const fixUrl = (url) => {
        if (!url) return null;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    };

    // Save Profile
    const handleSave = async () => {
        try {
            const updatedUser = await updateProfile({
                bio: formData.bio,
                github_username: formData.github_username,
                linkedin_url: fixUrl(formData.linkedin_url),
                portfolio_url: fixUrl(formData.portfolio_url),
                tech_skills: Array.isArray(formData.tech_skills) ? formData.tech_skills.filter(s => s.trim()) : [],
            });
            setUser(updatedUser);
            if (updatedUser.github_username && updatedUser.github_username !== user.github_username) {
                fetchGithubDetails(updatedUser.github_username);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            // safe error parsing
            let errorMessage = "Failed to update profile.";
            if (error.response && error.response.data) {
                // If data is object, try to join values
                const data = error.response.data;
                if (typeof data === 'object') {
                    const messages = Object.entries(data).map(([key, value]) => {
                        const valStr = Array.isArray(value) ? value.join(' ') : String(value);
                        return `${key}: ${valStr}`;
                    });
                    errorMessage = messages.join('\n');
                } else {
                    errorMessage = String(data);
                }
            }
            alert(errorMessage);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_new_password) {
            alert("New passwords do not match!");
            return;
        }

        try {
            await changePassword(passwordData);
            alert("Password updated successfully!");
            setIsChangingPassword(false);
            setPasswordData({ old_password: '', new_password: '', confirm_new_password: '' });
        } catch (error) {
            console.error("Failed to change password", error);
            alert(error.response?.data?.old_password?.[0] || error.response?.data?.new_password?.[0] || "Failed to change password.");
        }
    };

    if (loading) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header / Banner */}
            <div className="glass-panel rounded-xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E0FF] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

                {/* Avatar */}
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-[#0a0a0a] border-2 border-[#00E0FF] shadow-[0_0_20px_rgba(0,224,255,0.3)] flex-shrink-0 relative group">
                    <img
                        src={user.avatar || (user.github_username ? `https://github.com/${user.github_username}.png` : `https://ui-avatars.com/api/?name=${user.full_name}&background=random`)}
                        alt="Profile"
                        className="w-full h-full object-cover filter contrast-125 hover:contrast-100 transition-all"
                    />
                    {/* Scanner line animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#00E0FF]/50 shadow-[0_0_10px_#00E0FF] animate-[scan_2s_linear_infinite] opacity-50 pointer-events-none"></div>
                </div>

                {/* Info */}
                <div className="flex-1 z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-white font-mono tracking-wide flex items-center gap-3">
                                {user.full_name}
                                {user.is_club_admin && <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded border border-red-500/50 uppercase tracking-wider">Admin Level Access</span>}
                            </h1>
                            <p className="text-[#00E0FF] font-mono mt-1 text-sm mb-4">@{user.username} • <span className="text-gray-400">STATUS: ACTIVE</span></p>

                            <div className="flex flex-wrap gap-4 font-mono text-xs">
                                <div className="bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-lg flex items-center gap-2 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#00E0FF]/5 group-hover:bg-[#00E0FF]/10 transition-colors"></div>
                                    <span className="text-gray-400 uppercase tracking-wider">Rank</span>
                                    <span className="text-[#00E0FF] font-bold text-lg">#{user.rank || 'N/A'}</span>
                                </div>
                                <div className="bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-lg flex items-center gap-2 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#00E0FF]/5 group-hover:bg-[#00E0FF]/10 transition-colors"></div>
                                    <span className="text-gray-400 uppercase tracking-wider">Attendance</span>
                                    <span className="text-[#00E0FF] font-bold text-lg">{user.attendance_count || 0}</span>
                                </div>
                                <div className="bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-lg flex items-center gap-2 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#00E0FF]/5 group-hover:bg-[#00E0FF]/10 transition-colors"></div>
                                    <span className="text-gray-400 uppercase tracking-wider">XP</span>
                                    <span className="text-[#00E0FF] font-bold text-lg">{user.points || 0}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-[#1a1a1a] hover:bg-[#333] text-[#E0E0E0] border border-[#333] px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-mono text-xs uppercase tracking-wider"
                            >
                                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                                {isEditing ? 'CANCEL EDIT' : 'EDIT PROTOCOL'}
                            </button>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="bg-[#1a1a1a] hover:bg-[#333] text-[#E0E0E0] border border-[#333] px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-mono text-xs uppercase tracking-wider"
                                >
                                    <Lock size={16} /> SECURITY
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Password Change Modal - Dark Mode */}
                    {isChangingPassword && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="glass-panel p-8 rounded-xl w-full max-w-md shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#00E0FF]/30">
                                <h3 className="text-xl font-bold mb-6 text-[#00E0FF] font-mono uppercase tracking-widest border-b border-[#00E0FF]/20 pb-2">Update Credentials</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <input
                                        type="password"
                                        placeholder="CURRENT PASSWORD"
                                        value={passwordData.old_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                        className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded text-[#E0E0E0] focus:border-[#00E0FF] outline-none font-mono text-sm placeholder-gray-600"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="NEW PASSWORD"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded text-[#E0E0E0] focus:border-[#00E0FF] outline-none font-mono text-sm placeholder-gray-600"
                                        required
                                        minLength={8}
                                    />
                                    <input
                                        type="password"
                                        placeholder="CONFIRM NEW PASSWORD"
                                        value={passwordData.confirm_new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm_new_password: e.target.value })}
                                        className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded text-[#E0E0E0] focus:border-[#00E0FF] outline-none font-mono text-sm placeholder-gray-600"
                                        required
                                        minLength={8}
                                    />
                                    <div className="flex justify-end gap-2 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingPassword(false)}
                                            className="px-4 py-2 text-gray-400 hover:text-white font-mono text-xs uppercase"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/50 rounded hover:bg-[#00E0FF]/20 font-bold font-mono text-xs uppercase transition-all shadow-[0_0_10px_rgba(0,224,255,0.1)]"
                                        >
                                            Execute Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-4 text-gray-400 text-xs font-mono">
                        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
                            <Mail size={14} className="text-[#00E0FF]" /> {user.email}
                        </div>
                        {user.student_id && (
                            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
                                <User size={14} className="text-[#00E0FF]" /> ID: {user.student_id}
                            </div>
                        )}
                        {user.batch_year && (
                            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
                                <Calendar size={14} className="text-[#00E0FF]" /> BATCH: {user.batch_year}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <textarea
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleChange}
                            placeholder="INITIALIZE BIO SEQUENCE..."
                            className="w-full mt-6 p-4 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#00E0FF] outline-none text-[#E0E0E0] font-mono text-sm placeholder-gray-700"
                            rows="3"
                        />
                    ) : (
                        <div className="mt-6 p-4 bg-[#1a1a1a]/50 border-l-2 border-[#00E0FF] rounded-r-lg">
                            <p className="text-gray-300 font-mono text-sm leading-relaxed">
                                <span className="text-[#00E0FF] mr-2">{`>`}</span>
                                {user.bio || "BIO DATA CORRUPTED OR MISSING."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Socials, Skills, Stats */}
                <div className="md:col-span-1 space-y-8">

                    {/* Social Links */}
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#00E0FF] font-mono uppercase tracking-wider">
                            <LinkIcon size={18} /> Connections
                        </h3>
                        <div className="space-y-3">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} placeholder="LinkedIn URL" className="w-full p-2 bg-[#0a0a0a] border border-[#333] rounded text-sm text-gray-300 outline-none focus:border-[#00E0FF]" />
                                    <input name="github_username" value={formData.github_username || ''} onChange={handleChange} placeholder="GitHub Username" className="w-full p-2 bg-[#0a0a0a] border border-[#333] rounded text-sm text-gray-300 outline-none focus:border-[#00E0FF]" />
                                    <input name="portfolio_url" value={formData.portfolio_url || ''} onChange={handleChange} placeholder="Portfolio URL" className="w-full p-2 bg-[#0a0a0a] border border-[#333] rounded text-sm text-gray-300 outline-none focus:border-[#00E0FF]" />
                                </div>
                            ) : (
                                <>
                                    {user.linkedin_url && (
                                        <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#1a1a1a] p-2 rounded transition-colors border border-transparent hover:border-[#333]">
                                            <Linkedin size={18} className="text-[#0077b5]" /> LinkedIn
                                        </a>
                                    )}
                                    {user.github_username && (
                                        <a href={`https://github.com/${user.github_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#1a1a1a] p-2 rounded transition-colors border border-transparent hover:border-[#333]">
                                            <Github size={18} className="text-white" /> GitHub
                                        </a>
                                    )}
                                    {user.portfolio_url && (
                                        <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#1a1a1a] p-2 rounded transition-colors border border-transparent hover:border-[#333]">
                                            <LinkIcon size={18} className="text-emerald-500" /> Portfolio
                                        </a>
                                    )}
                                    {!user.linkedin_url && !user.github_username && !user.portfolio_url && (
                                        <p className="text-gray-600 text-xs font-mono italic p-2">NO EXTERNAL LINKS DETECTED.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tech Skills */}
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#00E0FF] font-mono uppercase tracking-wider">
                            <Code size={18} /> Abilities
                        </h3>

                        {isEditing ? (
                            <input
                                name="tech_skills"
                                value={formData.tech_skills ? formData.tech_skills.join(', ') : ''}
                                onChange={handleSkillsChange}
                                placeholder="Python, React, etc."
                                className="w-full p-2 bg-[#0a0a0a] border border-[#333] rounded text-sm text-gray-300 outline-none focus:border-[#00E0FF]"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {user.tech_skills && user.tech_skills.length > 0 ? (
                                    user.tech_skills.map((skill, index) => (
                                        <span key={index} className="bg-[#1a1a1a] border border-[#333] text-gray-300 text-xs font-mono px-3 py-1 rounded hover:border-[#00E0FF] transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-xs font-mono italic">NO SKILLS INDEXED.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* GitHub Stats */}
                    {user.github_username && !isEditing && (
                        <div className="glass-panel rounded-xl p-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Github size={64} />
                            </div>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#00E0FF] font-mono uppercase tracking-wider relative z-10">
                                <Github size={18} /> GitHub Matrix
                            </h3>

                            {githubData ? (
                                <div className="space-y-4 relative z-10">
                                    {/* GitHub Bio */}
                                    {githubData.bio && (
                                        <p className="text-gray-400 text-xs font-mono border-l border-gray-700 pl-2">"{githubData.bio}"</p>
                                    )}

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-2 text-center bg-[#0a0a0a] p-3 rounded-lg border border-[#333]">
                                        <div>
                                            <div className="text-lg font-bold text-white font-mono">{githubData.public_repos}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Repos</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-white font-mono">{githubData.followers}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-white font-mono">{githubData.following}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Following</div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="space-y-2 text-xs text-gray-500 font-mono">
                                        {githubData.company && (
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={12} className="text-[#00E0FF]" /> {githubData.company}
                                            </div>
                                        )}
                                        {githubData.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={12} className="text-[#00E0FF]" /> {githubData.location}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-[#00E0FF]" /> INIT: {new Date(githubData.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <a
                                        href={githubData.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-center mt-2 text-[#00E0FF] text-xs hover:underline font-mono"
                                    >
                                        [ ACCESS GITHUB REPO ]
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-[#00E0FF] font-mono text-sm animate-pulse">
                                    DOWNLOADING GITHUB DATA...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Projects */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl p-8 h-full min-h-[400px]">
                        <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white font-mono tracking-wider">
                                <Briefcase className="text-[#00E0FF]" /> MISSION LOG
                            </h2>
                            <span className="bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/30 text-xs px-3 py-1 rounded font-bold font-mono">
                                {projects.length} ACTIVE
                            </span>
                        </div>

                        {projects.length > 0 ? (
                            <div className="space-y-4">
                                {projects.map(project => (
                                    <div key={project.id} className="bg-[#1a1a1a]/50 border border-[#333] rounded-lg p-6 hover:border-[#00E0FF]/40 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-200 group-hover:text-[#00E0FF] transition-colors font-mono">
                                                {project.name}
                                            </h3>
                                            <span className={`px-2 py-1 text-[10px] rounded border font-bold uppercase tracking-widest font-mono ${project.status === 'completed' ? 'text-green-400 border-green-400/30' :
                                                project.status === 'in_progress' ? 'text-yellow-400 border-yellow-400/30' : 'text-gray-400 border-gray-600'
                                                }`}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>

                                        <div className="flex items-center gap-6 text-xs text-gray-500 font-mono">
                                            <span>STARTED: {new Date(project.created_at).toLocaleDateString()}</span>
                                            {project.lead && (
                                                <div className="flex items-center gap-2">
                                                    <span>LEADER:</span>
                                                    <div className="w-5 h-5 rounded overflow-hidden border border-[#333]">
                                                        <img
                                                            src={project.lead.avatar || `https://ui-avatars.com/api/?name=${project.lead.full_name}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-600 border border-dashed border-[#333] rounded-lg bg-[#0a0a0a]/50">
                                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-mono text-sm">NO MISSIONS ASSIGNED.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Button for Edit Mode - Floating with Neon Glow */}
            {isEditing && (
                <div className="fixed bottom-8 right-8 flex gap-4 animate-in slide-in-from-bottom-10 z-50">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="bg-[#050505] text-gray-400 px-6 py-3 rounded-lg border border-[#333] hover:text-white hover:border-white transition-all font-mono font-bold uppercase shadow-lg"
                    >
                        Abort
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-[#00E0FF] text-[#050505] px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(0,224,255,0.4)] hover:bg-[#00c2dd] hover:scale-105 transition-all font-bold font-mono uppercase flex items-center gap-2"
                    >
                        <Check size={18} /> Save Config
                    </button>
                </div>
            )}

            {/* Global Keyframes for Scanner (Simulated via standard CSS in index, but added specific one inline if needed or stick to index) */}
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
