import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Home, FolderKanban, Trophy, UserCheck, Calendar } from 'lucide-react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Project', path: '/projects', icon: FolderKanban },
        { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
        { name: 'Attendance', path: '/attendance', icon: UserCheck },
        { name: 'Meetings', path: '/meetings', icon: Calendar }
    ];

    return (
        <div
            className={`bg-[#5A5A5A] min-h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header with Logo and Toggle Button */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="14" stroke="#5A5A5A" strokeWidth="2" />
                                <path d="M16 8L20 16L16 24L12 16L16 8Z" fill="#5A5A5A" />
                            </svg>
                        </div>
                        <span className="text-white font-semibold text-lg whitespace-nowrap">NST-SDC</span>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-white flex-shrink-0"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>
            </div>


            {/* Navigation Menu */}
            <nav className="flex-1 px-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-white transition-all ${isActive ? 'bg-[#7FD4B8]' : 'hover:bg-gray-600'
                                } ${isCollapsed ? 'justify-center' : ''}`
                            }
                            title={isCollapsed ? item.name : ''}
                        >
                            <Icon size={20} className="flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="whitespace-nowrap">
                                    {item.name}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>


            {/* Footer Section */}
            <div className="p-4">
                <button
                    className={`nav-item flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-800 font-semibold bg-[#7FD4B8] transition-all duration-300 hover:bg-[#6ec2a5] hover:shadow-lg hover:-translate-y-0.5 ${isCollapsed ? 'justify-center' : ''}`}
                    onClick={() => console.log('Login clicked')}
                >
                    <UserCheck size={20} className="flex-shrink-0" />
                    {!isCollapsed && (
                        <span className="whitespace-nowrap">Login</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

