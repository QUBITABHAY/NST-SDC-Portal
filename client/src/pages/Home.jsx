import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../api/dashboard';
import ProjectCard from '../components/ProjectCard'; // We might reuse this or create a mini version

const Home = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (err) {
                console.error("Failed to fetch dashboard:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("Please log in to view your dashboard.");
                } else {
                    setError("Failed to load dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    // If not logged in, show a friendly message (maybe moving towards a Login page later)
    if (error) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to NST-SDC Portal</h1>
                <p className="text-red-500 mb-4">{error}</p>
                {/* Placeholder for login button */}
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Log in
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Hi, {data.user.name || data.user.username} 👋</h1>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
                    Points: {data.user.points}
                </div>
            </div>

            <div className="h-full grid grid-cols-3 grid-rows-2 gap-4 p-1">
                {/* Notices / Upcoming Events */}
                <div className="bg-[#E5E5E5] rounded-lg p-4 col-span-2 row-span-1 overflow-y-auto">
                    <h2 className="text-2xl mb-2 font-['Inria_Sans'] font-light">Upcoming Events</h2>
                    <div className="w-full border-t-2 border-black mb-4"></div>

                    {data.upcoming_events.length > 0 ? (
                        <div className="space-y-4">
                            {data.upcoming_events.map(event => (
                                <div key={event.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{event.title}</h3>
                                        <p className="text-sm text-gray-600">{new Date(event.event_date).toLocaleDateString()} at {event.location}</p>
                                    </div>
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full uppercase">{event.event_type}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No upcoming events.</p>
                    )}
                </div>

                {/* Assigned Issues / Tasks */}
                <div className="bg-[#E5E5E5] rounded-lg p-4 col-span-2 row-start-2 overflow-y-auto">
                    <h2 className="text-2xl mb-2 font-['Inria_Sans'] font-light">Assigned Tasks</h2>
                    <div className="w-full border-t-2 border-black mb-4"></div>

                    {data.active_tasks.length > 0 ? (
                        <div className="space-y-4">
                            {data.active_tasks.map(task => (
                                <div key={task.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{task.title}</h3>
                                        <p className="text-sm text-gray-600">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
                                        {task.status_display}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No active tasks assigned to you.</p>
                    )}
                </div>

                {/* Recent Works / Projects */}
                <div className="bg-[#E5E5E5] rounded-lg p-4 row-span-2 col-start-3 overflow-y-auto">
                    <h2 className="text-2xl mb-2 font-['Inria_Sans'] font-light">Recent Projects</h2>
                    <div className="w-full border-t-2 border-black mb-4"></div>

                    {data.recent_projects.length > 0 ? (
                        <div className="space-y-4">
                            {data.recent_projects.map(project => (
                                <div key={project.id} className="bg-white p-3 rounded shadow-sm pb-4">
                                    <h3 className="font-bold mb-1">{project.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800`}>
                                        {project.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No recent projects.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
