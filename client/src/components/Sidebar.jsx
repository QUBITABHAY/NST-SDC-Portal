import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Menu, Home, FolderKanban, Users, Trophy, UserCheck, Calendar, User, LogOut, Shield } from 'lucide-react';
import { logoutUser } from '../api/auth';
import { getProfile } from '../api/profile';

const Sidebar = ({ onNavigate }) => { // Accept prop
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const data = await getProfile();
                setUser(data);
                if (data.is_club_admin || data.is_staff || data.is_superuser) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        checkAdminStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            // Ideally clear context here
            navigate('/login');
        }
    };

    const handleNavClick = (e, path) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate();
            // Allow time for exit animation or just brief pause
            setTimeout(() => {
                navigate(path);
            }, 100);
        } else {
            navigate(path);
        }
    };

    const menuItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Project', path: '/projects', icon: FolderKanban },
        { name: 'Members', path: '/members', icon: Users },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
        { name: 'Attendance', path: '/attendance', icon: UserCheck },
        { name: 'Calendar', path: '/calendar', icon: Calendar },
        { name: 'Profile', path: '/profile', icon: User }
    ];

    if (isAdmin) {
        menuItems.push({ name: 'Admin', path: '/admin', icon: Shield });
    }

    return (
        <div
            className={`bg-[#0a0a0a] border-r border-[#1f1f1f] min-h-screen flex flex-col transition-all duration-300 relative z-20 overflow-visible ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header with Logo and Toggle Button */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00E0FF]/50 shadow-[0_0_15px_rgba(0,224,255,0.2)]">
                            <img src="/logo.jpg" alt="NST-SDC" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[#E0E0E0] font-bold text-lg whitespace-nowrap tracking-wider font-mono">NST-SDC</span>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-[#1f1f1f] hover:text-[#00E0FF] rounded-lg transition-colors text-gray-400 flex-shrink-0"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>
            </div>


            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={(e) => handleNavClick(e, item.path)}
                            className={({ isActive }) =>
                                `relative group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                                ${isActive
                                    ? 'bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/20 shadow-[0_0_10px_rgba(0,224,255,0.1)]'
                                    : 'text-gray-400 hover:bg-[#121212] hover:text-white'
                                } ${isCollapsed ? 'justify-center' : ''}`
                            }
                        >
                            <Icon size={20} className={`flex-shrink-0 transition-colors ${!isCollapsed && 'group-hover:text-[#00E0FF]'}`} />
                            {!isCollapsed && (
                                <span className="whitespace-nowrap font-medium font-sans">
                                    {item.name}
                                </span>
                            )}

                            {/* Custom Tooltip */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-6 px-3 py-2 bg-[#1f1f1f] text-[#00E0FF] text-xs rounded border border-[#00E0FF]/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg font-mono">
                                    {item.name}
                                    {/* Arrow */}
                                    <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-[#00E0FF]/30"></div>
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>


            {/* Footer Section */}
            <div className="p-4 border-t border-[#1f1f1f]">
                {user && !isCollapsed && (
                    <div className="mb-4 px-2">
                        <div className="text-xs text-gray-500 font-mono">LOGGED IN AS:</div>
                        <div className="text-sm font-bold text-gray-300 truncate">{user.username || user.email}</div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-red-500/80 hover:bg-[#1f1f1f] hover:text-red-400 transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <LogOut size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

