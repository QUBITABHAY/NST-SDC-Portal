import { useState } from 'react';
import UserManagement from '../../components/admin/UserManagement';
import EventManagement from '../../components/admin/EventManagement';
import ProjectManagement from '../../components/admin/ProjectManagement';
import TaskManagement from '../../components/admin/TaskManagement';
import { Users, Calendar, Briefcase, CheckSquare } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />;
            case 'events':
                return <EventManagement />;
            case 'projects':
                return <ProjectManagement />;
            case 'tasks':
                return <TaskManagement />;
            default:
                return <UserManagement />;
        }
    };

    return (
        <div className="p-8 min-h-full">
            <h1 className="text-3xl font-bold font-mono tracking-wider flex items-center gap-3 text-white mb-8">
                <span className="text-[#00E0FF] text-4xl">{`>`}</span>
                ADMIN CONSOLE
            </h1>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 border-b border-[#333] pb-1">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center px-6 py-3 rounded-t-lg transition-all font-mono tracking-wide ${activeTab === 'users'
                        ? 'bg-[#00E0FF]/10 text-[#00E0FF] border-t border-x border-[#00E0FF]/30 shadow-[0_-5px_15px_rgba(0,224,255,0.05)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                        }`}
                >
                    <Users size={16} className="mr-2" />
                    USER_DB
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`flex items-center px-6 py-3 rounded-t-lg transition-all font-mono tracking-wide ${activeTab === 'events'
                        ? 'bg-[#00E0FF]/10 text-[#00E0FF] border-t border-x border-[#00E0FF]/30 shadow-[0_-5px_15px_rgba(0,224,255,0.05)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                        }`}
                >
                    <Calendar size={16} className="mr-2" />
                    EVENT_LOGS
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center px-6 py-3 rounded-t-lg transition-all font-mono tracking-wide ${activeTab === 'projects'
                        ? 'bg-[#00E0FF]/10 text-[#00E0FF] border-t border-x border-[#00E0FF]/30 shadow-[0_-5px_15px_rgba(0,224,255,0.05)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                        }`}
                >
                    <Briefcase size={16} className="mr-2" />
                    PROJECT_OPS
                </button>
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex items-center px-6 py-3 rounded-t-lg transition-all font-mono tracking-wide ${activeTab === 'tasks'
                        ? 'bg-[#00E0FF]/10 text-[#00E0FF] border-t border-x border-[#00E0FF]/30 shadow-[0_-5px_15px_rgba(0,224,255,0.05)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                        }`}
                >
                    <CheckSquare size={16} className="mr-2" />
                    PROTOCOLS
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-[#0a0a0a] rounded-xl border border-[#333] p-6 min-h-[500px] shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E0FF]/5 rounded-full blur-3xl -z-10"></div>

                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
